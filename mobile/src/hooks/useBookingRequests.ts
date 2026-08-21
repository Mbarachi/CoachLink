import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingRequestsService } from '@/services/bookingRequests.service';
import type {
  BookingRequestQuery,
  CreateBookingRequestDto,
  UpdateBookingRequestDto,
} from '@/types';

export const bookingRequestKeys = {
  all: ['booking-requests'] as const,
  list: (params?: BookingRequestQuery) => ['booking-requests', 'list', params ?? {}] as const,
  detail: (id: string) => ['booking-requests', 'detail', id] as const,
};

/** The API scopes this by role: a coach gets requests received, others sent. */
export function useBookingRequests(params?: BookingRequestQuery) {
  return useQuery({
    queryKey: bookingRequestKeys.list(params),
    queryFn: () => bookingRequestsService.list(params),
    // Requests change as coaches respond, so keep this fresher than coaches.
    staleTime: 1000 * 30,
  });
}

export function useBookingRequest(id: string | undefined) {
  return useQuery({
    queryKey: bookingRequestKeys.detail(id ?? ''),
    queryFn: () => bookingRequestsService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateBookingRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBookingRequestDto) => bookingRequestsService.create(dto),
    onSuccess: () => void qc.invalidateQueries({ queryKey: bookingRequestKeys.all }),
  });
}

export function useRespondToBookingRequest(id: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateBookingRequestDto) => bookingRequestsService.update(id!, dto),
    onSuccess: () => void qc.invalidateQueries({ queryKey: bookingRequestKeys.all }),
  });
}
