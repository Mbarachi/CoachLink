import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import type { QueryConstraint } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { NotFoundError } from '@/lib/apiError';
import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type { Booking, BookingQuery, UpdateBookingDto } from '@/types';

import { toBooking } from './mappers';

const bookings = () => collection(firebaseDb(), 'bookings');

function requireUid(): string {
  const uid = firebaseAuth().currentUser?.uid;
  if (!uid) throw new Error('You must be signed in.');
  return uid;
}

export const bookingsService = {
  /**
   * Scoped on exactly the field the security rule authorises on. Filtering any
   * other way — by coachId, say — is refused outright rather than returning
   * nothing, because rules validate the query rather than its results.
   */
  async list(params?: BookingQuery): Promise<Booking[]> {
    const uid = requireUid();

    const asCoach = await getDocs(query(
      collection(firebaseDb(), 'coachProfiles'), where('userId', '==', uid),
    ));
    const scope: QueryConstraint = asCoach.empty
      ? where('athleteId', '==', uid)
      : where('coach.userId', '==', uid);

    const constraints: QueryConstraint[] = [scope];
    if (params?.status) constraints.push(where('status', '==', params.status));

    // Sorted client-side so no combination of filters needs its own composite
    // index; one person's sessions are few enough that it costs nothing.
    const snap = await getDocs(query(bookings(), ...constraints));
    return snap.docs
      .map((d) => toBooking(d.id, d.data()))
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  },

  async getById(id: string): Promise<Booking> {
    const snap = await getDoc(doc(bookings(), id));
    if (!snap.exists()) throw new NotFoundError('That session is no longer available.');
    return toBooking(snap.id, snap.data());
  },

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const res = await httpsCallable(firebaseFunctions(), 'updateBooking')({
      bookingId: id, status: dto.status,
    });
    const data = res.data as Record<string, unknown> & { id: string };
    return toBooking(data.id, data);
  },
};
