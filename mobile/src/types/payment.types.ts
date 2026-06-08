export type PaymentProvider = 'PAYSTACK';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  transactionReference: string;
  status: PaymentStatus;
}

export interface InitializePaymentDto {
  bookingId: string;
}

export interface InitializePaymentResponse {
  paymentId: string;
  authorizationUrl: string;
  reference: string;
}
