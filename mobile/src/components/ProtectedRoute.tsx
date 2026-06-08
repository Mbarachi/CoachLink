import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  component: React.ComponentType;
  path: string;
  exact?: boolean;
}

/**
 * Redirects unauthenticated users to /welcome.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? <Component /> : <Redirect to="/welcome" />
      }
    />
  );
};

export default ProtectedRoute;
