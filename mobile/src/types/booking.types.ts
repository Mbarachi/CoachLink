import type { Sport } from './coach.types';

export type BookingRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED';

export type BookingMode = 'SINGLE' | 'PACKAGE';

/**
 * A booking exists from the moment a coach accepts, but a session is not
 * confirmed until it is paid for — acceptance produces PENDING_PAYMENT and
 * only a successful payment promotes it to UPCOMING.
 */
export type BookingStatus = 'PENDING_PAYMENT' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface BookingRequestSession {
  id: string;
  /** ISO datetime, UTC. */
  scheduledAt: string;
}

export interface BookingRequest {
  id: string;
  athleteId: string;
  coachId: string;
  sportId: string;

  mode: BookingMode;
  /** Package only — how many weeks the recurrence runs for. */
  weeks: number | null;
  /** Package only — 0 = Sunday. Display metadata; `sessions` is authoritative. */
  daysOfWeek: number[];
  /** Coach-local start time, "HH:mm" on a 24-hour clock. */
  startTime: string;

  /** Snapshotted when the request was made, not read live off the coach. */
  sessionRate: number;
  sessionCount: number;
  totalAmount: number;

  notes: string | null;
  childName: string | null;
  childAge: number | null;

  /**
   * EXPIRED is derived server-side — a pending request whose first session has
   * passed reads as expired, so it never appears as a stored value.
   */
  status: BookingRequestStatus;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;

  sport: Sport;
  sessions: BookingRequestSession[];
  athlete: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    /** True when a parent booked on a child's behalf. */
    bookedForChild: boolean;
  };
  coach: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    venue: string;
  };
}

export interface CreateBookingRequestDto {
  coachId: string;
  sportId: string;
  mode: BookingMode;
  /** SINGLE: the session date. PACKAGE: the anchor the recurrence runs from. */
  startDate: string;
  startTime: string;
  weeks?: number;
  daysOfWeek?: number[];
  notes?: string;
  /** Required when the signed-in account is a PARENT, rejected otherwise. */
  childName?: string;
  childAge?: number;
}

/** A coach may ACCEPT or DECLINE; the athlete who booked may CANCEL. */
export interface UpdateBookingRequestDto {
  status: 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
}

export interface BookingRequestQuery {
  status?: BookingRequestStatus;
}

export interface Booking {
  id: string;
  bookingRequestId: string;
  athleteId: string;
  coachId: string;
  sportId: string;
  /** ISO datetime, UTC. One booking is one session. */
  scheduledAt: string;
  /** Snapshotted from the request, not read live off the coach. */
  sessionRate: number;
  status: BookingStatus;
  paidAt: string | null;
  cancelledAt: string | null;
  cancelledBy: 'ATHLETE' | 'COACH' | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;

  sport: Sport;
  athlete: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    bookedForChild: boolean;
  };
  coach: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    venue: string;
  };
}

export interface UpdateBookingDto {
  status: 'CANCELLED' | 'COMPLETED';
}

export interface BookingQuery {
  status?: BookingStatus;
}
