import { isFirebaseBackend } from './backend';

import { authService as nestAuth } from './auth.service';
import { bookingRequestsService as nestBookingRequests } from './bookingRequests.service';
import { coachesService as nestCoaches } from './coaches.service';
import { sportsService as nestSports } from './sports.service';
import { usersService as nestUsers } from './users.service';

import { authService as fbAuth } from './firebase/auth.service';
import { bookingRequestsService as fbBookingRequests } from './firebase/bookingRequests.service';
import { coachesService as fbCoaches } from './firebase/coaches.service';
import { sportsService as fbSports } from './firebase/sports.service';
import { usersService as fbUsers } from './firebase/users.service';

export const authService = isFirebaseBackend ? fbAuth : nestAuth;
export const usersService = isFirebaseBackend ? fbUsers : nestUsers;
export const sportsService = isFirebaseBackend ? fbSports : nestSports;
export const coachesService = isFirebaseBackend ? fbCoaches : nestCoaches;
export const bookingRequestsService = isFirebaseBackend ? fbBookingRequests : nestBookingRequests;

export { BACKEND, isFirebaseBackend } from './backend';
export type { SignUpDto, SignInDto, AuthResponse } from './auth.service';

// Modules with no backend behind them yet; both implementations are absent.
export { bookingsService } from './bookings.service';
export { notificationsService } from './notifications.service';
export { paymentsService } from './payments.service';
export { reviewsService } from './reviews.service';
