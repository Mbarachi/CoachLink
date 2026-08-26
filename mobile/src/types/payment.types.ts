export type PaymentProvider = 'PAYSTACK';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  /** Payment is per accepted request, not per session — one charge covers the package. */
  bookingRequestId: string;
  athleteId: string;
  coachId: string;
  /** Whole naira. Paystack is billed in kobo; the conversion stays server-side. */
  amount: number;
  sessions: number;
  currency: string;
  provider: PaymentProvider;
  reference: string;
  status: PaymentStatus;
  authorizationUrl: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InitializePaymentDto {
  bookingRequestId: string;
}

export interface InitializePaymentResponse {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
  amount: number;
  sessions: number;
}

export interface VerifyPaymentResponse {
  reference: string;
  paid: boolean;
  outcome: 'applied' | 'already-settled' | 'unknown';
}
