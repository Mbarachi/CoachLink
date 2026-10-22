import type { Booking } from '@/types';

/** Every session is an hour long; see the hours in slots.ts. */
const SESSION_MS = 60 * 60 * 1000;

/** True once a session's hour is over. */
export const hasEnded = (scheduledAt: string, now = Date.now()) =>
  new Date(scheduledAt).getTime() + SESSION_MS <= now;

/** True from a session's start time. The server stops taking payment then. */
const hasStarted = (scheduledAt: string, now = Date.now()) =>
  new Date(scheduledAt).getTime() <= now;

/**
 * A booking's status as the screens should show it.
 *
 * The stored status does not move when a session's hour passes: only the coach
 * marking it done does, and an unpaid one is never touched again. Left as
 * stored, a paid session from last week still reads "Upcoming" until the coach
 * acts. So time is applied here, for display; nothing is written back.
 *
 * - AWAITING_CONFIRMATION: paid, over, and not yet marked done by the coach.
 * - NOT_PAID: accepted, but its start time came before anyone paid. The
 *   server no longer takes payment for it from then.
 */
export type ShownStatus = Booking['status'] | 'AWAITING_CONFIRMATION' | 'NOT_PAID';

export function shownStatus(booking: Pick<Booking, 'status' | 'scheduledAt'>, now = Date.now()): ShownStatus {
  if (booking.status === 'PENDING_PAYMENT' && hasStarted(booking.scheduledAt, now)) return 'NOT_PAID';
  if (booking.status === 'UPCOMING' && hasEnded(booking.scheduledAt, now)) return 'AWAITING_CONFIRMATION';
  return booking.status;
}

/**
 * Ahead of the athlete still: a paid session until its hour is over, an unpaid
 * one until it starts (after that it can no longer be paid for).
 */
export const isAhead = (booking: Pick<Booking, 'status' | 'scheduledAt'>, now = Date.now()) =>
  (booking.status === 'UPCOMING' && !hasEnded(booking.scheduledAt, now))
  || (booking.status === 'PENDING_PAYMENT' && !hasStarted(booking.scheduledAt, now));

/** Newest first, for the Past piles. */
export const newestFirst = (a: { scheduledAt: string | null }, b: { scheduledAt: string | null }) =>
  (b.scheduledAt ?? '').localeCompare(a.scheduledAt ?? '');
