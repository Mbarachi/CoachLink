import { httpsCallable } from 'firebase/functions';

import { firebaseFunctions } from '@/lib/firebase';
import type {
  InitializePaymentDto, InitializePaymentResponse, VerifyPaymentResponse,
} from '@/types';

export const paymentsService = {
  /** Returns Paystack's hosted checkout URL; no card details touch this app. */
  async initialize(dto: InitializePaymentDto): Promise<InitializePaymentResponse> {
    const res = await httpsCallable(firebaseFunctions(), 'initializePayment')(dto);
    return res.data as InitializePaymentResponse;
  },

  /**
   * Asked when the athlete returns from checkout. The webhook is the authority
   * on whether money moved, but it can be delayed, and a phone that just paid
   * should not sit on a spinner waiting for it.
   */
  async verify(reference: string): Promise<VerifyPaymentResponse> {
    const res = await httpsCallable(firebaseFunctions(), 'verifyPayment')({ reference });
    return res.data as VerifyPaymentResponse;
  },
};
