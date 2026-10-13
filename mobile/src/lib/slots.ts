import type { Availability } from '@/types';

/**
 * Every hour a session may start, shared by the coach setting their hours and
 * the athlete picking one. Defined once so the two can never offer different
 * times — the server validates the same range.
 */
// Sessions are an hour long and fall between 9am and 7pm, so the last one
// starts at 6pm. Mirrors EARLIEST_HOUR and LATEST_HOUR in the backend's
// schedule.ts, which refuses anything outside them.
const FIRST_START = 9;
const LAST_START = 18;

export const SLOTS = Array.from({ length: LAST_START - FIRST_START + 1 }, (_, i) =>
  `${String(FIRST_START + i).padStart(2, '0')}:00`);

/**
 * Drops times outside today's hours. Coaches who set their availability when
 * sessions ran 5am to 10pm still have those early and late times saved; this
 * keeps them from being offered to athletes, and from blocking the coach's
 * own save, since the server now refuses them.
 */
export const withinHours = (times: string[] | undefined): string[] =>
  (times ?? []).filter((t) => SLOTS.includes(t));

/** "14:00" -> "2:00 PM" */
export const slotLabel = (slot: string) => {
  const hour = Number(slot.slice(0, 2));
  const suffix = hour < 12 ? 'AM' : 'PM';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:00 ${suffix}`;
};

export const DAY_LABELS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const;

/** Nothing published at all — the server reads this as "open", not "closed". */
export const hasNoAvailability = (availability?: Availability) =>
  !availability || Object.values(availability).every((times) => times.length === 0);
// Deliberately counts out-of-hours times: a coach whose only saved times were
// 6am is not "open all day", they are closed until they set new hours. The
// server reads it the same way.

/** What a coach offers on the weekday a given date falls on. */
export const slotsOnDate = (availability: Availability | undefined, date: Date): string[] => {
  if (hasNoAvailability(availability)) return SLOTS;
  return withinHours(availability?.[String(date.getDay())]);
};

/** "6:00 AM, 7:00 AM" for a summary row, or null when the day is closed. */
export const describeDay = (times: string[] | undefined) =>
  withinHours(times).length > 0 ? withinHours(times).map(slotLabel).join(', ') : null;
