import type { Booking } from '@/types';

/** Every session is an hour long; see the hours in slots.ts. */
const SESSION_MS = 60 * 60 * 1000;

/** True once a session's hour is over. */
export const hasEnded = (scheduledAt: string, now = Date.now()) =>
  new Date(scheduledAt).getTime() + SESSION_MS <= now;

/**
 * The coach may start a session from half an hour before it until an hour and
 * a half after. Mirrors START_FROM_BEFORE and START_UNTIL_AFTER in the
 * backend's sessionStart.ts, which is what actually refuses outside them.
 */
const START_FROM_BEFORE_MS = 30 * 60 * 1000;
const START_UNTIL_AFTER_MS = 90 * 60 * 1000;

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
 * - IN_PROGRESS: the coach started it with the athlete's code, and its hour
 *   is not over yet.
 */
export type ShownStatus = Booking['status'] | 'AWAITING_CONFIRMATION' | 'NOT_PAID' | 'IN_PROGRESS';

type Timed = Pick<Booking, 'status' | 'scheduledAt'> & { startedAt?: string | null };

export function shownStatus(booking: Timed, now = Date.now()): ShownStatus {
  if (booking.status === 'PENDING_PAYMENT' && hasStarted(booking.scheduledAt, now)) return 'NOT_PAID';
  if (booking.status === 'UPCOMING' && booking.startedAt && !hasEnded(booking.scheduledAt, now)) return 'IN_PROGRESS';
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

/** Paid, not started yet, and inside the window the coach may start it in. */
export function canStart(booking: Timed, now = Date.now()) {
  if (booking.status !== 'UPCOMING' || booking.startedAt) return false;
  const start = new Date(booking.scheduledAt).getTime();
  return now >= start - START_FROM_BEFORE_MS && now <= start + START_UNTIL_AFTER_MS;
}
