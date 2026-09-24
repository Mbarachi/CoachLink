export type PayoutStatus = 'PENDING' | 'SENT' | 'FAILED';

/** Where a coach gets paid. Confirmed with the bank before it is stored. */
export interface PayoutAccount {
  accountNumber: string;
  /** As the bank has it, not as the coach typed it. */
  accountName: string;
  bankCode: string;
  bankName: string;
  recipientCode: string;
  updatedAt: number;
}

export interface Payout {
  id: string;
  bookingId: string;
  coachUserId: string;
  /** What the session cost the athlete, before commission. */
  sessionRate: number;
  commissionRate: number;
  /** What the coach actually receives. */
  amount: number;
  status: PayoutStatus;
  failureReason: string | null;
  createdAt: string;
}

export interface Bank {
  name: string;
  code: string;
}

export interface SavePayoutAccountDto {
  accountNumber: string;
  bankCode: string;
  bankName: string;
}
