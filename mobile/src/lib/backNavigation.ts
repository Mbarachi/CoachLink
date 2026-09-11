import type { UserRole } from '@/types';

/**
 * What the Android hardware back button should do from a given route.
 *
 * Default is ordinary history — this only names the cases where going back
 * would be wrong: leaving the app from a root, re-entering sign-up after
 * signing in, or re-entering the app after signing out.
 */
export type BackAction =
  | { type: 'exit' }
  | { type: 'go'; to: string }
  | { type: 'history' };

const homeFor = (role: UserRole | undefined) =>
  role === 'COACH' ? '/coach/dashboard' : '/athlete/home';

/** Nothing sits behind these, so back leaves the app rather than unwinding. */
const ROOTS = new Set(['/athlete/home', '/coach/dashboard', '/welcome', '/splash']);

/**
 * Screens that end a flow. Their history entry is behind them, so plain back
 * would drop the user into a form they have already submitted.
 */
const TERMINAL: Record<string, string> = {
  '/athlete/booking-success': '/athlete/bookings',
  '/athlete/review-sent': '/athlete/bookings',
  '/auth/reset-success': '/auth/signin',
};

const isAuthRoute = (path: string) =>
  path.startsWith('/auth') || path === '/welcome' || path === '/splash';

const isAppRoute = (path: string) =>
  path.startsWith('/athlete') || path.startsWith('/coach');

export function resolveBack(
  pathname: string,
  { isAuthenticated, role }: { isAuthenticated: boolean; role?: UserRole },
): BackAction {
  if (ROOTS.has(pathname)) {
    return { type: 'exit' };
  }

  // Submitted flows: never reopen the form behind a confirmation screen.
  const terminal = Object.keys(TERMINAL).find((prefix) => pathname.startsWith(prefix));
  if (terminal) {
    return { type: 'go', to: TERMINAL[terminal] };
  }

  // Signed in: sign-up, verification and role selection are all behind us.
  // Walking back into them lets someone re-run onboarding over a live account.
  if (isAuthenticated && isAuthRoute(pathname)) {
    return { type: 'go', to: homeFor(role) };
  }

  // Signed out: the app's own screens may still sit in history after a logout.
  if (!isAuthenticated && isAppRoute(pathname)) {
    return { type: 'go', to: '/welcome' };
  }

  return { type: 'history' };
}
