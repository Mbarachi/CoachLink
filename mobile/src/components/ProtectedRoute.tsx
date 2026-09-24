import React from 'react';
import { Redirect, Route } from 'react-router-dom';

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
}

const homeFor = (role: UserRole | undefined) =>
  (role === 'COACH' ? '/coach/dashboard' : '/athlete/home');

/** Sends a signed-out visitor to /welcome, and a signed-in one to their own side. */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  roles,
  ...rest
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);

  return (
    <Route
      {...rest}
      render={() => {
        if (!isAuthenticated) return <Redirect to="/welcome" />;
        // No role yet means onboarding never finished; the role screen is
        // where that is picked up, not a dashboard they have no data for.
        if (!role) return <Redirect to="/auth/role" />;
        if (roles && !roles.includes(role)) return <Redirect to={homeFor(role)} />;
        return <Component />;
      }}
    />
  );
};

export default ProtectedRoute;
