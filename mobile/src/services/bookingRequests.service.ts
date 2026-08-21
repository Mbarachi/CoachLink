import api from './api';
import type {
  BookingRequest,
  BookingRequestQuery,
  CreateBookingRequestDto,
  UpdateBookingRequestDto,
} from '@/types';

export const bookingRequestsService = {
  create: (dto: CreateBookingRequestDto) =>
    api.post<BookingRequest>('/booking-requests', dto).then((r) => r.data),

  /** Coaches receive the requests sent to them; everyone else gets their own. */
  list: (params?: BookingRequestQuery) =>
    api.get<BookingRequest[]>('/booking-requests', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<BookingRequest>(`/booking-requests/${id}`).then((r) => r.data),

  update: (id: string, dto: UpdateBookingRequestDto) =>
    api.patch<BookingRequest>(`/booking-requests/${id}`, dto).then((r) => r.data),
};
