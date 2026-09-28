/**
 * Abstraction over a payment processor. Raw card details are NEVER handled
 * by this app — the provider's hosted checkout/redirect flow owns that, and
 * we only ever receive a reference to verify server-side.
 */

export interface InitializePaymentInput {
  /** Amount in the smallest currency unit (e.g. kobo for NGN) */
  amountMinorUnits: number;
  currency: string;
  email: string;
  /** Internal Order.id — becomes provider metadata for reconciliation */
  orderId: string;
  callbackUrl: string;
}

export interface InitializePaymentResult {
  /** URL to redirect the customer to for hosted checkout */
  authorizationUrl: string;
  /** Provider's reference for this transaction — store as Payment.providerReference */
  reference: string;
}

export interface VerifyPaymentResult {
  reference: string;
  success: boolean;
  amountMinorUnits: number;
  currency: string;
  paidAt?: Date;
  raw: unknown;
}

export interface RefundPaymentInput {
  reference: string;
  amountMinorUnits?: number; // omit for full refund
  reason?: string;
}

export interface RefundPaymentResult {
  success: boolean;
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: string;

  initializePayment(input: InitializePaymentInput): Promise<InitializePaymentResult>;
  /** Always call this server-side before marking an order paid — never trust client redirects alone. */
  verifyPayment(reference: string): Promise<VerifyPaymentResult>;
  refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
