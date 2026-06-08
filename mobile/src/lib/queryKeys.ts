/**
 * Centralised React Query key factory.
 * Import these in every useQuery / useMutation call to guarantee cache consistency.
 */
export const queryKeys = {
  // Auth
  me: ['me'] as const,

  // Coaches
  coaches: {
    all: ['coaches'] as const,
    list: (params?: object) => ['coaches', 'list', params] as const,
    detail: (id: string) => ['coaches', 'detail', id] as const,
  },

  // Sports
  sports: ['sports'] as const,

  // Booking Requests
  bookingRequests: {
    all: ['bookingRequests'] as const,
    list: () => ['bookingRequests', 'list'] as const,
    detail: (id: string) => ['bookingRequests', 'detail', id] as const,
  },

  // Bookings
  bookings: {
    all: ['bookings'] as const,
    list: () => ['bookings', 'list'] as const,
    detail: (id: string) => ['bookings', 'detail', id] as const,
  },

  // Payments
  payments: {
    detail: (id: string) => ['payments', 'detail', id] as const,
  },

  // Reviews
  reviews: {
    byCoach: (coachId: string) => ['reviews', 'coach', coachId] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
  },
} as const;
