import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { reviewsService } from '@/services';
import type { CreateReviewDto } from '@/types';

export const reviewKeys = {
  all: ['reviews'] as const,
  forCoach: (coachId: string) => ['reviews', 'coach', coachId] as const,
  forBooking: (bookingId: string) => ['reviews', 'booking', bookingId] as const,
  mine: () => ['reviews', 'mine'] as const,
};

export function useCoachReviews(coachId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.forCoach(coachId ?? ''),
    queryFn: () => reviewsService.listForCoach(coachId!),
    enabled: Boolean(coachId),
  });
}

/** Null means "not reviewed yet", which is what gates the review action. */
export function useBookingReview(bookingId: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.forBooking(bookingId ?? ''),
    queryFn: () => reviewsService.forBooking(bookingId!),
    enabled: Boolean(bookingId),
  });
}

/** The set of my bookings already reviewed, for prompting on the ones not. */
export function useMyReviewedBookings() {
  return useQuery({
    queryKey: reviewKeys.mine(),
    queryFn: () => reviewsService.myReviewedBookingIds(),
    staleTime: 1000 * 60,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReviewDto) => reviewsService.create(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: reviewKeys.all });
      // The coach's average and review count both move with it.
      void qc.invalidateQueries({ queryKey: ['coaches'] });
    },
  });
}
