export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CoachProfile {
  id: string;
  userId: string;
  bio: string;
  yearsOfExperience: number;
  hourlyRate: number;
  state: string;
  area: string;
  verificationStatus: VerificationStatus;
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
  hourlyRate: number;
  state: string;
  area: string;
  sportIds: string[];
}

export type UpdateCoachProfileDto = Partial<CreateCoachProfileDto>;

export interface CoachQueryParams {
  sport?: string;
  state?: string;
  area?: string;
  page?: number;
  limit?: number;
}
