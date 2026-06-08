import api from './api';
import type {
  BookingRequest,
  CreateBookingRequestDto,
  UpdateBookingRequestDto,
} from '@/types';

export const bookingRequestsService = {
  create: (dto: CreateBookingRequestDto) =>
    api.post<BookingRequest>('/booking-requests', dto).then((r) => r.data),

  list: () =>
    api.get<BookingRequest[]>('/booking-requests').then((r) => r.data),

  getById: (id: string) =>
    api.get<BookingRequest>(`/booking-requests/${id}`).then((r) => r.data),

  update: (id: string, dto: UpdateBookingRequestDto) =>
    api.patch<BookingRequest>(`/booking-requests/${id}`, dto).then((r) => r.data),
};
