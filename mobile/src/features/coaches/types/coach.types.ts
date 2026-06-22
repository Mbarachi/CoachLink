export type Sport = 'Tennis' | 'Swimming';

export type Venue =
  | 'MU Court'
  | 'Festival Hotel Pool'
  | 'Golden Tulip Pool'
  | 'Appleton School'
  | 'Private Residence';

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  sport: Sport;
  venue: Venue;
  area: string;
  rating: number;
  reviewCount: number;
  yearsOfExperience: number;
  sessionRate: number;
  bio: string;
  isVerified: boolean;
}

export type SortOption = 'highest-rated' | 'lowest-price' | 'most-experienced';
export type SportFilter = 'All' | Sport;
