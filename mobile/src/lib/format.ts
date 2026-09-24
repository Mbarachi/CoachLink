/** Shared formatters so pages don't each reinvent naira and date rendering. */

export const formatNaira = (amount: number) => `₦${Number(amount).toLocaleString('en-NG')}`;

export const initialsOf = (firstName?: string | null, lastName?: string | null) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';

export const fullName = (firstName?: string | null, lastName?: string | null) =>
  [firstName, lastName].filter(Boolean).join(' ').trim();

/** "Wed, 15 May" */
export const formatSessionDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' });

/** "8:00 AM" */
export const formatSessionTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit', hour12: true });

export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

/** Sunday-first weekday names, matching the API's 0-6 daysOfWeek. */
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const describeSchedule = (daysOfWeek: number[], weeks: number | null) => {
  const days = daysOfWeek.map((d) => DAY_NAMES[d]).join(' & ');
  return weeks ? `${days} for ${weeks} weeks` : days;
};

/** Greeting matched to the reader's own clock. */
export const timeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 18) return 'Good afternoon,';
  return 'Good evening,';
};

/**
 * Compact age for a notification row: 2m, 3h, 5d, then a date. Rounded down,
 * because "1h" reading as 59 minutes old is fine and "in 0 seconds" is not.
 */
export const formatRelativeTime = (iso: string) => {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return formatShortDate(iso);
};

