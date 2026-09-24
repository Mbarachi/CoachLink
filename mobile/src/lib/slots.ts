import type { Availability } from '@/types';

/**
 * Every hour a session may start, shared by the coach setting their hours and
 * the athlete picking one. Defined once so the two can never offer different
 * times — the server validates the same range.
 */
export const SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 5; // 05:00 through 21:00
  return `${String(hour).padStart(2, '0')}:00`;
});

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

/** What a coach offers on the weekday a given date falls on. */
export const slotsOnDate = (availability: Availability | undefined, date: Date): string[] => {
  if (hasNoAvailability(availability)) return SLOTS;
  return availability?.[String(date.getDay())] ?? [];
};

/** "6:00 AM, 7:00 AM" for a summary row, or null when the day is closed. */
export const describeDay = (times: string[] | undefined) =>
  times && times.length > 0 ? times.map(slotLabel).join(', ') : null;
