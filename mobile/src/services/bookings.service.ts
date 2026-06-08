import api from './api';
import type { Booking, UpdateBookingDto } from '@/types';

export const bookingsService = {
  list: () =>
    api.get<Booking[]>('/bookings').then((r) => r.data),

  getById: (id: string) =>
    api.get<Booking>(`/bookings/${id}`).then((r) => r.data),

  update: (id: string, dto: UpdateBookingDto) =>
    api.patch<Booking>(`/bookings/${id}`, dto).then((r) => r.data),
};
