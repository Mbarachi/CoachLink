import type { PayoutAccount } from './payout.types';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * Weekday ("0" = Sunday) to the times that day opens, as "HH:00".
 *
 * A weekly pattern rather than dated slots: a coach says "Mondays at 6 and 7"
 * once instead of keeping a calendar forever. An empty map means they have
 * published nothing, and the server treats that as open rather than making
 * them unbookable.
 */
export type Availability = Record<string, string[]>;

/** Who a coach takes on. Mirrors AGE_GROUPS in the backend's types.ts. */
export type AgeGroup = 'CHILD' | 'ADULT';
/** Where their learners start from. Mirrors LEVELS in the backend's types.ts. */
export type Level = 'BEGINNER' | 'IMPROVING';

export interface CoachProfile {
  id: string;
  userId: string;
  bio: string;
  yearsOfExperience: number;
  /** Whole naira, per session. */
  sessionRate: number;
  /** Venue-based discovery per the MVP scope, e.g. "Festival Hotel Pool". */
  venue: string;
  area: string;
  /** Empty for a profile made before this was asked: not said, not "nobody". */
  ageGroups: AgeGroup[];
  /** Empty for a profile made before this was asked. */
  levels: Level[];
  verificationStatus: VerificationStatus;
  /** Why an admin rejected or approved. Shown to the coach on a rejection. */
  verificationNote: string | null;
  /** Which attempt this is; 2 or more means the coach has resubmitted. */
  submissionCount: number;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  availability: Availability;
  /** Absent until the coach says where to pay them. */
  payoutAccount: PayoutAccount | null;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

export interface CoachSport {
  coachId: string;
  sportId: string;
}

/** Extended coach view returned by GET /coaches and GET /coaches/:id */
export interface Coach {
  profile: CoachProfile;
  sports: Sport[];
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface CreateCoachProfileDto {
  bio: string;
  yearsOfExperience: number;
  sessionRate: number;
  venue: string;
  area?: string;
  ageGroups: AgeGroup[];
  levels: Level[];
  sportIds: string[];
  availability?: Availability;
}

export type UpdateCoachProfileDto = Partial<CreateCoachProfileDto>;

export interface CoachQueryParams {
  sport?: string;
  venue?: string;
  search?: string;
  page?: number;
  limit?: number;
}
