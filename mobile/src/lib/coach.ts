import type { Coach } from '@/types';

import { fullName, initialsOf } from './format';

/**
 * The API returns a coach as { profile, sports, firstName, ... }. These keep
 * pages from reaching through that shape by hand every time.
 */
export const coachName = (coach: Coach) => fullName(coach.firstName, coach.lastName);

export const coachInitials = (coach: Coach) => initialsOf(coach.firstName, coach.lastName);

export const coachSportNames = (coach: Coach) => coach.sports.map((s) => s.name);

export const primarySport = (coach: Coach) => coach.sports[0]?.name ?? 'Coach';

/** Distinct venues across a result set, for filter chips. */
export const venuesOf = (coaches: Coach[]) =>
  Array.from(new Set(coaches.map((c) => c.profile.venue))).sort();
