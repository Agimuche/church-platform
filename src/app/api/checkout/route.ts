import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getPaymentProvider } from "@/lib/providers/payment";
import { checkoutSchema } from "@/lib/validation/checkout";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Sign in to check out." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid cart.", details: parsed.error.flatten() }, { status: 400 });
  }

  // Prices always come from the database, never from the client — this is
  // what stops someone from POSTing a fake price for an item.
  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isPublished: true },
  });

  if (products.length !== productIds.length) {
    return Response.json({ error: "One or more items are unavailable." }, { status: 400 });
  }

  const orderItems = parsed.data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return { productId: product.id, quantity: item.quantity, unitPrice: product.price };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalAmount,
      status: "PENDING",
      items: { create: orderItems },
    },
  });

  const origin = new URL(req.url).origin;
  const paymentProvider = await getPaymentProvider();

  const result = await paymentProvider.initializePayment({
    amountMinorUnits: Math.round(totalAmount * 100),
    currency: "NGN",
    email: session.user.email ?? "",
    orderId: order.id,
    callbackUrl: `${origin}/account/orders/${order.id}`,
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: paymentProvider.name,
      providerReference: result.reference,
      amount: totalAmount,
      currency: "NGN",
      status: "PENDING",
    },
  });

  return Response.json({ authorizationUrl: result.authorizationUrl, orderId: order.id });
}
