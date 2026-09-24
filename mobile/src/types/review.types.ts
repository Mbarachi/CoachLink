export interface Review {
  id: string;
  athleteId: string;
  coachId: string;
  bookingId: string;
  /** 1–5. */
  rating: number;
  comment: string | null;
  /** Snapshotted on the review, so a coach page renders from one read. */
  athleteName: string;
  athleteImage: string | null;
  createdAt: string;
}

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment?: string;
}
