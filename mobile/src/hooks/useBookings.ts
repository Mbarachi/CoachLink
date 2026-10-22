import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingsService } from '@/services';
import type { BookingQuery, UpdateBookingDto } from '@/types';

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (params?: BookingQuery) => ['bookings', 'list', params ?? {}] as const,
  detail: (id: string) => ['bookings', 'detail', id] as const,
  startCode: (id: string) => ['bookings', 'startCode', id] as const,
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

/** Only asked for while it can be used: a paid session not yet started or over. */
export function useStartCode(id: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: bookingKeys.startCode(id ?? ''),
    queryFn: () => bookingsService.getStartCode(id!),
    enabled: Boolean(id) && enabled,
    // It never changes, so there is nothing to refetch.
    staleTime: Infinity,
  });
}

export function useStartSession(id: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => bookingsService.startSession(id!, code),
    onSuccess: () => void qc.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}
