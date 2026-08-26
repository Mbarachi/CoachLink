/**
 * One backend. The Nest implementations and the VITE_BACKEND switch that chose
 * between them are gone — they existed to compare the two, and Firebase won.
 */
export { authService } from './firebase/auth.service';
export { usersService } from './firebase/users.service';
export { sportsService } from './firebase/sports.service';
export { coachesService } from './firebase/coaches.service';
export { bookingRequestsService } from './firebase/bookingRequests.service';
export { bookingsService } from './firebase/bookings.service';
export { uploadCoachFiles } from './firebase/uploads';
export type { CoachUploads } from './firebase/uploads';
