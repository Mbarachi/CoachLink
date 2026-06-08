export interface Review {
  id: string;
  athleteId: string;
  coachId: string;
  bookingId: string;
  rating: number; // 1–5
  comment: string | null;
  createdAt: string;
}

export interface CreateReviewDto {
  coachId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}
