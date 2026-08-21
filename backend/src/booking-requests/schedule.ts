import { BadRequestException } from '@nestjs/common';

/**
 * Lagos has been UTC+1 year-round since 1919 and observes no DST, so a fixed
 * offset is safe. Revisit if the product ever launches outside Nigeria.
 */
const LAGOS_OFFSET = '+01:00';

/** A coach-local calendar date plus wall-clock time, as a UTC instant. */
export function toInstant(date: string, time: string): Date {
  return new Date(`${date}T${time}:00${LAGOS_OFFSET}`);
}

function assertRealDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new BadRequestException(`${date} is not a real calendar date.`);
  }
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Weekday of a coach-local calendar date, 0 = Sunday. */
function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

interface Recurrence {
  startDate: string;
  startTime: string;
  weeks: number;
  daysOfWeek: number[];
}

/**
 * Expands a weekly recurrence into concrete instants. Week 1 is the seven days
 * beginning at `startDate`, so every occurrence falls on or after it and the
 * count is always exactly `weeks * daysOfWeek.length`.
 */
export function expandRecurrence({
  startDate,
  startTime,
  weeks,
  daysOfWeek,
}: Recurrence): Date[] {
  assertRealDate(startDate);

  const instants: Date[] = [];
  for (let week = 0; week < weeks; week++) {
    const windowStart = addDays(startDate, week * 7);
    const windowStartDay = weekdayOf(windowStart);
    for (const day of daysOfWeek) {
      const offset = (day - windowStartDay + 7) % 7;
      instants.push(toInstant(addDays(windowStart, offset), startTime));
    }
  }
  return instants.sort((a, b) => a.getTime() - b.getTime());
}

export function singleSession(startDate: string, startTime: string): Date[] {
  assertRealDate(startDate);
  return [toInstant(startDate, startTime)];
}
