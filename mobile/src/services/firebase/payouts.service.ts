import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type { Bank, Payout, PayoutAccount, SavePayoutAccountDto } from '@/types';

import { toIso } from './mappers';

function requireUid(): string {
  const uid = firebaseAuth().currentUser?.uid;
  if (!uid) throw new Error('You must be signed in.');
  return uid;
}

export const payoutsService = {
  async banks(): Promise<Bank[]> {
    const res = await httpsCallable(firebaseFunctions(), 'banks')();
    return res.data as Bank[];
  },

  async saveAccount(dto: SavePayoutAccountDto): Promise<PayoutAccount> {
    const res = await httpsCallable(firebaseFunctions(), 'savePayoutAccount')(dto);
    return res.data as PayoutAccount;
  },

  /** Scoped on coachUserId, which is the field the security rule authorises on. */
  async list(): Promise<Payout[]> {
    const uid = requireUid();
    const snap = await getDocs(query(
      collection(firebaseDb(), 'payouts'),
      where('coachUserId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(100),
    ));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        bookingId: data.bookingId,
        coachUserId: data.coachUserId,
        sessionRate: data.sessionRate ?? 0,
        commissionRate: data.commissionRate ?? 0,
        amount: data.amount ?? 0,
        status: data.status ?? 'PENDING',
        failureReason: data.failureReason ?? null,
        createdAt: toIso(data.createdAt),
      } as Payout;
    });
  },
};
