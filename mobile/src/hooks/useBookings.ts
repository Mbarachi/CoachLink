import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingsService } from '@/services';
import type { BookingQuery, UpdateBookingDto } from '@/types';

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (params?: BookingQuery) => ['bookings', 'list', params ?? {}] as const,
  detail: (id: string) => ['bookings', 'detail', id] as const,
};

/** Role-scoped by the service: a coach gets their sessions, an athlete theirs. */
export function useBookings(params?: BookingQuery) {
  return useQuery({
    queryKey: bookingKeys.list(params),
    queryFn: () => bookingsService.list(params),
    staleTime: 1000 * 30,
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(id ?? ''),
    queryFn: () => bookingsService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useUpdateBooking(id: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateBookingDto) => bookingsService.update(id!, dto),
    onSuccess: () => void qc.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}
