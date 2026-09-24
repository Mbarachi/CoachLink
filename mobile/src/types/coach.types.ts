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
  verificationStatus: VerificationStatus;
  /** Why an admin rejected or approved. Shown to the coach on a rejection. */
  verificationNote: string | null;
  /** Which attempt this is; 2 or more means the coach has resubmitted. */
  submissionCount: number;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  availability: Availability;
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
