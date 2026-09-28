import {
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentProvider,
  RefundPaymentInput,
  RefundPaymentResult,
  VerifyPaymentResult,
} from "./types";

/** Always-succeeds payment provider for local development without real credentials. */
class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async initializePayment(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    const reference = `mock_${input.orderId}_${Date.now()}`;
    return {
      authorizationUrl: `${input.callbackUrl}?reference=${reference}&mock=1`,
      reference,
    };
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResult> {
    return {
      reference,
      success: true,
      amountMinorUnits: 0,
      currency: "NGN",
      paidAt: new Date(),
      raw: { mock: true },
    };
  }

  async refundPayment(_input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return { success: true, raw: { mock: true } };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
