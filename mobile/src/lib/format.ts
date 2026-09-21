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
