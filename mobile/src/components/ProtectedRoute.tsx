import React from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  component: React.ComponentType;
  path: string;
  exact?: boolean;
  /**
   * Who this branch is for. Signing in is not the same as belonging here: an
   * athlete who lands on /coach would otherwise get the coach tab bar and a
   * string of permission errors instead of a redirect.
   */
  roles?: readonly UserRole[];
  /**
   * Keeps this branch shut while the account is partway through coach
   * sign-up. The server still calls them an athlete until the profile is
   * submitted, so without this the athlete screens open, briefly showing an
   * "Athlete" tag on someone who is becoming a coach.
   */
  closedDuringCoachSignup?: boolean;
}

const homeFor = (role: UserRole | undefined) =>
  (role === 'COACH' ? '/coach/dashboard' : '/athlete/home');

/** Sends a signed-out visitor to /welcome, and a signed-in one to their own side. */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  roles,
  closedDuringCoachSignup = false,
  ...rest
}) => {
  const history = useHistory();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);
  const coachDraftPending = useAuthStore((s) => s.coachDraftPending);

  return (
    <Route
      {...rest}
      render={() => {
        if (!isAuthenticated) return <Redirect to="/welcome" />;
        // No role yet means onboarding never finished; the role screen is
        // where that is picked up, not a dashboard they have no data for.
        if (!role) return <Redirect to="/auth/role" />;
        if (roles && !roles.includes(role)) return <Redirect to={homeFor(role)} />;
        // Checked against where the app actually is, not this route's own
        // match: Ionic keeps left pages rendered, and a hidden Settings page
        // re-rendering must not drag the user anywhere.
        if (closedDuringCoachSignup && coachDraftPending === true
            && history.location.pathname.startsWith(rest.path)) {
          return <Redirect to="/auth/coach-onboarding" />;
        }
        return <Component />;
      }}
    />
  );
};

export default ProtectedRoute;
