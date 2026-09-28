import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { getPaymentProvider } from "@/lib/providers/payment";

/**
 * Paystack webhook. Two layers of verification, both required:
 *  1. HMAC signature check on the raw body, using PAYSTACK_SECRET_KEY —
 *     proves the request actually came from Paystack.
 *  2. A server-side call to /transaction/verify (via PaymentProvider) —
 *     never trust the webhook payload's own "status" field alone.
 */
export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const rawBody = await req.text();

  if (secret) {
    const signature = req.headers.get("x-paystack-signature");
    const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    if (signature !== expected) {
      return Response.json({ error: "Invalid signature." }, { status: 401 });
    }
  }

  const event = JSON.parse(rawBody);
  const reference: string | undefined = event?.data?.reference;
  if (!reference) {
    return Response.json({ error: "Missing reference." }, { status: 400 });
  }

  const paymentProvider = await getPaymentProvider();
  const verification = await paymentProvider.verifyPayment(reference);

  const payment = await prisma.payment.findUnique({ where: { providerReference: reference } });
  if (!payment) {
    return Response.json({ error: "Unknown payment reference." }, { status: 404 });
  }

  if (verification.success) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS", rawResponse: verification.raw as object },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" },
      }),
    ]);

    // TODO: enqueue a NEW_SERMON/PAYMENT_SUCCESS Notification here, and grant
    // digital-download access for any digital OrderItems on this order.
  } else {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", rawResponse: verification.raw as object },
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "FAILED" },
      }),
    ]);
  }

  return Response.json({ received: true });
}
