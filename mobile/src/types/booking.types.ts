import type { Sport } from './coach.types';

export type BookingRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED';

export type BookingMode = 'SINGLE' | 'PACKAGE';

export type BookingStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

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
  sessionDate: string; // ISO datetime string
  status: BookingStatus;
}

export interface UpdateBookingDto {
  status: BookingStatus;
}
