import { Timestamp } from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import type { Booking, BookingRequest, Coach, User } from '@/types';

/**
 * Firestore hands back Timestamps where the REST API sent ISO strings. Every
 * page renders dates through `new Date(...)`, so normalising here keeps the
 * two backends indistinguishable above this layer.
 */
export const toIso = (value: unknown): string => {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return new Date(value).toISOString();

  // Callable functions return JSON, so a Timestamp arrives as a plain object
  // rather than the class — and the key is _seconds over the wire but seconds
  // when it comes straight from the SDK. Missing this renders every date from
  // a mutation response as 1970.
  if (value && typeof value === 'object') {
    const t = value as { seconds?: number; _seconds?: number; nanoseconds?: number; _nanoseconds?: number };
    const seconds = t.seconds ?? t._seconds;
    if (typeof seconds === 'number') {
      const nanos = t.nanoseconds ?? t._nanoseconds ?? 0;
      return new Date(seconds * 1000 + Math.floor(nanos / 1e6)).toISOString();
    }
  }

  return new Date(0).toISOString();
};

export function toUser(uid: string, data: DocumentData): User {
  return {
    id: uid,
    firstName: data.firstName ?? '',
    lastName: data.lastName ?? '',
    email: data.email ?? '',
    phoneNumber: data.phoneNumber ?? '',
    role: data.role ?? 'ATHLETE',
    profileImage: data.profileImage ?? null,
    isVerified: data.isVerified ?? true,
    address: data.address ?? null,
    state: data.state ?? null,
    lga: data.lga ?? null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

/**
 * The Nest API nests the profile under `profile` and lists sports alongside
 * it. Firestore stores one flat document, so it is unpacked back into the
 * shape every page already expects.
 */
export function toCoach(id: string, data: DocumentData): Coach {
  const [firstName = '', ...rest] = String(data.coachName ?? '').trim().split(' ');
  return {
    profile: {
      id,
      userId: data.userId,
      bio: data.bio ?? '',
      yearsOfExperience: data.yearsOfExperience ?? 0,
      sessionRate: data.sessionRate ?? 0,
      venue: data.venue ?? '',
      area: data.area ?? '',
      verificationStatus: data.verificationStatus ?? 'PENDING',
      rating: data.rating ?? 0,
      totalReviews: data.totalReviews ?? 0,
      isActive: data.isActive ?? true,
    },
    sports: (data.sports ?? []).map((s: DocumentData) => ({
      id: s.id, name: s.name, icon: s.icon, isActive: true,
    })),
    firstName,
    lastName: rest.join(' '),
    profileImage: data.profileImage ?? null,
  };
}

export const coachFromSnap = (snap: QueryDocumentSnapshot<DocumentData>) =>
  toCoach(snap.id, snap.data());

/**
 * Sessions live as a `sessionAts` array rather than child documents, because
 * that is what lets the conflict check stay a single array-contains-any query
 * server-side. They are expanded back into the objects the UI iterates over.
 */
export function toBookingRequest(id: string, data: DocumentData): BookingRequest {
  const sessions = (data.sessionAts ?? []).map((at: unknown, i: number) => ({
    id: `${id}-${i}`,
    scheduledAt: toIso(at),
  }));

  // The server derives EXPIRED rather than storing it, but a direct Firestore
  // read returns the raw field — so the same rule is applied here, otherwise
  // a lapsed request would still read as PENDING in the app.
  const first = sessions[0];
  const status = data.status === 'PENDING' && first && new Date(first.scheduledAt).getTime() < Date.now()
    ? 'EXPIRED'
    : data.status;

  return {
    id,
    athleteId: data.athleteId,
    coachId: data.coachId,
    sportId: data.sportId,
    mode: data.mode,
    weeks: data.weeks ?? null,
    daysOfWeek: data.daysOfWeek ?? [],
    startTime: data.startTime ?? '',
    sessionRate: data.sessionRate ?? 0,
    sessionCount: data.sessionCount ?? sessions.length,
    totalAmount: data.totalAmount ?? 0,
    notes: data.notes ?? null,
    childName: data.childName ?? null,
    childAge: data.childAge ?? null,
    status,
    respondedAt: data.respondedAt ? toIso(data.respondedAt) : null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    sport: data.sport,
    sessions,
    athlete: data.athlete,
    coach: data.coach,
  };
}

export function toBooking(id: string, data: DocumentData): Booking {
  return {
    id,
    bookingRequestId: data.bookingRequestId,
    athleteId: data.athleteId,
    coachId: data.coachId,
    sportId: data.sportId,
    scheduledAt: toIso(data.scheduledAt),
    sessionRate: data.sessionRate ?? 0,
    status: data.status,
    paidAt: data.paidAt ? toIso(data.paidAt) : null,
    cancelledAt: data.cancelledAt ? toIso(data.cancelledAt) : null,
    cancelledBy: data.cancelledBy ?? null,
    completedAt: data.completedAt ? toIso(data.completedAt) : null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    sport: data.sport,
    athlete: data.athlete,
    coach: data.coach,
  };
}
