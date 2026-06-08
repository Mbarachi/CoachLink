export type BookingRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
export type BookingStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface BookingRequest {
  id: string;
  athleteId: string;
  coachId: string;
  sportId: string;
  proposedDate: string; // ISO date string
  proposedTime: string; // HH:mm
  notes: string | null;
  status: BookingRequestStatus;
}

export interface CreateBookingRequestDto {
  coachId: string;
  sportId: string;
  proposedDate: string;
  proposedTime: string;
  notes?: string;
}

export interface UpdateBookingRequestDto {
  status: BookingRequestStatus;
}

export interface Booking {
  id: string;
  bookingRequestId: string;
  athleteId: string;
  coachId: string;
  sportId: string;
  sessionDate: string; // ISO datetime string
  status: BookingStatus;
}

export interface UpdateBookingDto {
  status: BookingStatus;
}
