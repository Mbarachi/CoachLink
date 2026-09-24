import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type { CreateReviewDto, Review } from '@/types';

import { toIso } from './mappers';

export const reviewsService = {
  /** Public, because the coach page is browsable before signing in. */
  async listForCoach(coachId: string): Promise<Review[]> {
    const snap = await getDocs(query(
      collection(firebaseDb(), 'reviews'),
      where('coachId', '==', coachId),
      orderBy('createdAt', 'desc'),
      limit(50),
    ));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        bookingId: data.bookingId,
        athleteId: data.athleteId,
        coachId: data.coachId,
        rating: Number(data.rating) || 0,
        comment: data.comment ?? null,
        athleteName: data.athlete?.firstName
          ? `${data.athlete.firstName} ${data.athlete.lastName ?? ''}`.trim()
          : 'An athlete',
        athleteImage: data.athlete?.profileImage ?? null,
        createdAt: toIso(data.createdAt),
      };
    });
  },

  /** One per booking, so this doubles as "has this session been reviewed". */
  async forBooking(bookingId: string): Promise<Review | null> {
    const snap = await getDocs(query(
      collection(firebaseDb(), 'reviews'),
      where('bookingId', '==', bookingId),
      limit(1),
    ));
    if (snap.empty) return null;
    const d = snap.docs[0];
    const data = d.data();
    return {
      id: d.id,
      bookingId: data.bookingId,
      athleteId: data.athleteId,
      coachId: data.coachId,
      rating: Number(data.rating) || 0,
      comment: data.comment ?? null,
      athleteName: 'You',
      athleteImage: null,
      createdAt: toIso(data.createdAt),
    };
  },

  /**
   * Which of my sessions I have already reviewed. One read for the whole list
   * screen, rather than a query per row — and the review id is the booking id,
   * so the caller only needs the ids.
   */
  async myReviewedBookingIds(): Promise<string[]> {
    const uid = firebaseAuth().currentUser?.uid;
    if (!uid) return [];
    const snap = await getDocs(query(
      collection(firebaseDb(), 'reviews'),
      where('athleteId', '==', uid),
      limit(200),
    ));
    return snap.docs.map((d) => d.id);
  },

  async create(dto: CreateReviewDto): Promise<void> {
    await httpsCallable(firebaseFunctions(), 'createReview')(dto);
  },
};
