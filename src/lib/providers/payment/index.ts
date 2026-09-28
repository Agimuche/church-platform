import { PaymentProvider } from "./types";
import { mockPaymentProvider } from "./mock-provider";

export * from "./types";

let cached: PaymentProvider | null = null;

/**
 * Returns the configured PaymentProvider.
 *
 * PAYMENT_PROVIDER=mock (default) — always succeeds, no credentials needed.
 * PAYMENT_PROVIDER=paystack — requires PAYSTACK_SECRET_KEY.
 */
export async function getPaymentProvider(): Promise<PaymentProvider> {
  if (cached) return cached;

  const provider = process.env.PAYMENT_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
      cached = mockPaymentProvider;
      return cached;
    case "paystack": {
      // Lazily imported so the mock path never requires the secret key to be set.
      const { PaystackProvider } = await import("./paystack-provider");
      cached = new PaystackProvider(process.env.PAYSTACK_SECRET_KEY ?? "");
      return cached;
    }
    default:
      throw new Error(
        `Unknown PAYMENT_PROVIDER "${provider}". Add an implementation in src/lib/providers/payment/ and register it here.`
      );
  }
}
