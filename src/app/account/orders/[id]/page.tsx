import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getPaymentProvider } from "@/lib/providers/payment";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reference?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: OrderPageProps) {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/account/orders`);

  const { id } = await params;
  const { reference } = await searchParams;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { include: { product: true } }, payments: true },
  });
  if (!order) notFound();

  // If we arrived from the payment provider's redirect with a reference and
  // the order is still pending, re-verify server-side before showing status —
  // never trust the redirect alone (the webhook is the source of truth, but
  // this gives the user immediate feedback too).
  if (reference && order.status === "PENDING") {
    const paymentProvider = await getPaymentProvider();
    const verification = await paymentProvider.verifyPayment(reference);
    if (verification.success) {
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: { orderId: order.id, providerReference: reference },
          data: { status: "SUCCESS" },
        }),
        prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
      ]);
      order.status = "PAID";
    }
  }

  return (
    <div className="container-app max-w-2xl py-12">
      <h1 className="font-serif text-2xl font-semibold text-ink">Order Confirmation</h1>
      <div className="mt-4 flex items-center gap-3">
        <Badge variant={order.status === "PAID" ? "default" : "gold"}>{order.status}</Badge>
        <span className="text-sm text-ink-muted">{formatDate(order.createdAt)}</span>
      </div>

      <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-paper">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 text-sm">
            <span className="text-ink">{item.product.name} × {item.quantity}</span>
            <span className="text-ink-muted">{formatCurrency(item.unitPrice.toString())}</span>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 text-sm font-medium">
          <span className="text-ink">Total</span>
          <span className="text-ink">{formatCurrency(order.totalAmount.toString(), order.currency)}</span>
        </div>
      </div>
    </div>
  );
}
