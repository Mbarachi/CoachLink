export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
}

export type UpdateCoachProfileDto = Partial<CreateCoachProfileDto>;

export interface CoachQueryParams {
  sport?: string;
  venue?: string;
  search?: string;
  page?: number;
  limit?: number;
}
