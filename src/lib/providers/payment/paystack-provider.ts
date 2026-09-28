import {
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentProvider,
  RefundPaymentInput,
  RefundPaymentResult,
  VerifyPaymentResult,
} from "./types";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

/**
 * Paystack implementation of PaymentProvider. Requires PAYSTACK_SECRET_KEY.
 * Docs: https://paystack.com/docs/api/
 */
export class PaystackProvider implements PaymentProvider {
  readonly name = "paystack";

  constructor(private readonly secretKey: string) {
    if (!secretKey) {
      throw new Error(
        "PaystackProvider requires PAYSTACK_SECRET_KEY. Add it to your environment before using STREAMING_PROVIDER=paystack."
      );
    }
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    const json = await res.json();
    if (!res.ok || json.status === false) {
      throw new Error(`Paystack error: ${json.message ?? res.statusText}`);
    }
    return json.data as T;
  }

  async initializePayment(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    const data = await this.request<{ authorization_url: string; reference: string }>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          amount: input.amountMinorUnits,
          email: input.email,
          currency: input.currency,
          callback_url: input.callbackUrl,
          metadata: { orderId: input.orderId },
        }),
      }
    );

    return { authorizationUrl: data.authorization_url, reference: data.reference };
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResult> {
    const data = await this.request<{
      status: string;
      amount: number;
      currency: string;
      paid_at: string | null;
    }>(`/transaction/verify/${encodeURIComponent(reference)}`);

    return {
      reference,
      success: data.status === "success",
      amountMinorUnits: data.amount,
      currency: data.currency,
      paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
      raw: data,
    };
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    const data = await this.request<unknown>("/refund", {
      method: "POST",
      body: JSON.stringify({
        transaction: input.reference,
        amount: input.amountMinorUnits,
        customer_note: input.reason,
      }),
    });

    return { success: true, raw: data };
  }
}
