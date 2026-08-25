import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import type { QueryConstraint } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type {
  BookingRequest, BookingRequestQuery, CreateBookingRequestDto, UpdateBookingRequestDto,
} from '@/types';

import { toBookingRequest } from './mappers';

const requests = () => collection(firebaseDb(), 'bookingRequests');

function requireUid(): string {
  const uid = firebaseAuth().currentUser?.uid;
  if (!uid) throw new Error('You must be signed in.');
  return uid;
}

export const bookingRequestsService = {
  /**
   * Role-scoped like the REST endpoint: a coach sees what was sent to them,
   * everyone else sees their own. The scope has to be an explicit `where`
   * because the rules evaluate per returned document — an unscoped query is
   * refused outright rather than silently filtered.
   */
  async list(params?: BookingRequestQuery): Promise<BookingRequest[]> {
    const uid = requireUid();

    const asCoach = await getDocs(query(
      collection(firebaseDb(), 'coachProfiles'), where('userId', '==', uid),
    ));
    const scope: QueryConstraint = asCoach.empty
      ? where('athleteId', '==', uid)
      : where('coachId', '==', asCoach.docs[0].id);

    const constraints: QueryConstraint[] = [scope];
    if (params?.status) constraints.push(where('status', '==', params.status));
    constraints.push(orderBy('createdAt', 'desc'));

    const snap = await getDocs(query(requests(), ...constraints));
    return snap.docs.map((d) => toBookingRequest(d.id, d.data()));
  },

  async getById(id: string): Promise<BookingRequest> {
    const snap = await getDoc(doc(requests(), id));
    if (!snap.exists()) throw new Error('Booking request not found.');
    return toBookingRequest(snap.id, snap.data());
  },

  async create(dto: CreateBookingRequestDto): Promise<BookingRequest> {
    const res = await httpsCallable(firebaseFunctions(), 'createBookingRequest')(dto);
    const data = res.data as Record<string, unknown> & { id: string };
    return toBookingRequest(data.id, data);
  },

  async update(id: string, dto: UpdateBookingRequestDto): Promise<BookingRequest> {
    const res = await httpsCallable(firebaseFunctions(), 'respondToBookingRequest')({
      requestId: id, status: dto.status,
    });
    const data = res.data as Record<string, unknown> & { id: string };
    return toBookingRequest(data.id, data);
  },
};
