import api from './api';
import type { CreateReviewDto, Review } from '@/types';

export const reviewsService = {
  create: (dto: CreateReviewDto) =>
    api.post<Review>('/reviews', dto).then((r) => r.data),

  listByCoach: (coachId: string) =>
    api.get<Review[]>(`/reviews/coach/${coachId}`).then((r) => r.data),
};
