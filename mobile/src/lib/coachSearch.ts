import type { AgeGroup, Coach, Level } from '@/types';

import { hasNoAvailability, slotLabel, slotsOnDate, withinHours } from './slots';

/**
 * The athlete's "Find a coach" screen, as plain functions over a list of
 * coaches it already holds.
 *
 * Filtering happens on the phone, not in the query. There is one
 * neighbourhood's worth of coaches, and six filters plus three sort orders
 * would need a Firestore composite index for every combination of them.
 */

export type WhenFilter = 'WEEKDAY_MORNING' | 'WEEKDAY_AFTERNOON' | 'WEEKEND';
export type BudgetFilter = 'LOW' | 'MID' | 'HIGH';
export type SortKey = 'RATING' | 'PRICE' | 'EXPERIENCE';

export interface CoachFilters {
  sport: string | null;
  ageGroup: AgeGroup | null;
  level: Level | null;
  when: WhenFilter | null;
  budget: BudgetFilter | null;
  venue: string | null;
  /** A name typed behind the magnifier. While set, the other filters step aside. */
  name: string;
}

export const NO_FILTERS: CoachFilters = {
  sport: null, ageGroup: null, level: null, when: null, budget: null, venue: null, name: '',
};

interface Option<T> { value: T; label: string }

export const AGE_GROUP_OPTIONS: Option<AgeGroup>[] = [
  { value: 'CHILD', label: 'A child' },
  { value: 'ADULT', label: 'An adult' },
];

export const LEVEL_OPTIONS: Option<Level>[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'IMPROVING', label: 'Improving' },
];

// Sessions run 9am to 7pm, so there is no "evening" to offer.
export const WHEN_OPTIONS: Option<WhenFilter>[] = [
  { value: 'WEEKDAY_MORNING', label: 'Weekday mornings' },
  { value: 'WEEKDAY_AFTERNOON', label: 'Weekday afternoons' },
  { value: 'WEEKEND', label: 'Weekends' },
];

export const BUDGET_OPTIONS: Option<BudgetFilter>[] = [
  { value: 'LOW', label: 'Under ₦10k' },
  { value: 'MID', label: '₦10k – ₦15k' },
  { value: 'HIGH', label: 'Over ₦15k' },
];

export const SORT_LABELS: Record<SortKey, string> = {
  RATING: 'Top rated',
  PRICE: 'Lowest price',
  EXPERIENCE: 'Most experienced',
};

export const NEXT_SORT: Record<SortKey, SortKey> = {
  RATING: 'PRICE',
  PRICE: 'EXPERIENCE',
  EXPERIENCE: 'RATING',
};

const inBudget = (rate: number, budget: BudgetFilter) =>
  budget === 'LOW' ? rate < 10_000 : budget === 'MID' ? rate <= 15_000 && rate >= 10_000 : rate > 15_000;

const WEEKDAYS = ['1', '2', '3', '4', '5'];

function opensWhen(coach: Coach, when: WhenFilter) {
  const availability = coach.profile.availability;
  // Nothing published is read as open everywhere, the same as booking does.
  if (hasNoAvailability(availability)) return true;
  if (when === 'WEEKEND') {
    return withinHours(availability['0']).length > 0 || withinHours(availability['6']).length > 0;
  }
  const morning = when === 'WEEKDAY_MORNING';
  return WEEKDAYS.some((day) =>
    withinHours(availability[day]).some((t) => (Number(t.slice(0, 2)) < 12) === morning));
}

/**
 * A coach who has not answered a question yet passes that filter. They were
 * listed before it was asked, and hiding them would punish them for that
 * rather than for teaching the wrong people.
 */
const answers = <T>(given: T[], wanted: T) => given.length === 0 || given.includes(wanted);

export function matches(coach: Coach, f: CoachFilters) {
  const name = f.name.trim().toLowerCase();
  if (name) {
    return `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(name);
  }
  const p = coach.profile;
  return (!f.sport || coach.sports.some((s) => s.name === f.sport))
    && (!f.ageGroup || answers(p.ageGroups, f.ageGroup))
    && (!f.level || answers(p.levels, f.level))
    && (!f.when || opensWhen(coach, f.when))
    && (!f.budget || inBudget(p.sessionRate, f.budget))
    && (!f.venue || p.venue === f.venue);
}

export function sortCoaches(coaches: Coach[], key: SortKey) {
  return [...coaches].sort((a, b) => {
    if (key === 'PRICE') return a.profile.sessionRate - b.profile.sessionRate;
    if (key === 'EXPERIENCE') return b.profile.yearsOfExperience - a.profile.yearsOfExperience;
    // A new coach's 0 is "no reviews", not "rated zero", so ties fall to
    // review count and new coaches sit after rated ones.
    return b.profile.rating - a.profile.rating || b.profile.totalReviews - a.profile.totalReviews;
  });
}

/** "Kids & adults", or null for a coach who has not said. */
export function ageGroupsTag(groups: AgeGroup[]) {
  if (groups.length === 0) return null;
  if (groups.length > 1) return 'Kids & adults';
  return groups[0] === 'CHILD' ? 'Kids' : 'Adults';
}

/** "Beginners & improvers", or null for a coach who has not said. */
export function levelsTag(levels: Level[]) {
  if (levels.length === 0) return null;
  if (levels.length > 1) return 'Beginners & improvers';
  return levels[0] === 'BEGINNER' ? 'Beginners' : 'Improvers';
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * The next hour this coach's weekly times leave open, as "Today 4 PM" or
 * "Sat 9 AM". It cannot see bookings, which only their two parties may read,
 * so this is when they next teach rather than a promise the slot is free.
 */
export function nextOpenLabel(coach: Coach, now = new Date()): string | null {
  for (let offset = 0; offset <= 7; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const times = slotsOnDate(coach.profile.availability, date)
      .filter((t) => offset > 0 || Number(t.slice(0, 2)) > now.getHours());
    if (times.length === 0) continue;
    const day = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : SHORT_DAYS[date.getDay()];
    return `${day} ${slotLabel(times[0]).replace(':00', '')}`;
  }
  return null;
}

export const coachCount = (n: number) => `${n} ${n === 1 ? 'coach' : 'coaches'}`;
