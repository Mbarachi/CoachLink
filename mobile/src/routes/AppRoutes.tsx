import { IonRouterOutlet } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute';
import CompleteProfilePage from '@/pages/auth/CompleteProfilePage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import OtpVerificationPage from '@/pages/auth/OtpVerificationPage';
import RoleSelectionPage from '@/pages/auth/RoleSelectionPage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import SplashPage from '@/pages/auth/SplashPage';
import WelcomePage from '@/pages/auth/WelcomePage';
import { useAuthStore } from '@/store/auth.store';

import AthleteRoutes from './AthleteRoutes';
import CoachRoutes from './CoachRoutes';

const AppRoutes: React.FC = () => {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <IonRouterOutlet id="main">
      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/splash" component={SplashPage} exact />
      <Route path="/welcome" component={WelcomePage} exact />
      <Route path="/auth/signin" component={SignInPage} exact />
      <Route path="/auth/signup" component={SignUpPage} exact />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} exact />
      <Route path="/auth/otp" component={OtpVerificationPage} exact />
      <Route path="/auth/role" component={RoleSelectionPage} exact />
      <Route path="/auth/complete-profile" component={CompleteProfilePage} exact />

      {/* ── Protected: Athlete / Parent ────────────────────── */}
      <ProtectedRoute path="/athlete" component={AthleteRoutes} />

      {/* ── Protected: Coach ───────────────────────────────── */}
      <ProtectedRoute path="/coach" component={CoachRoutes} />

      {/* ── Default redirect ───────────────────────────────── */}
      <Route exact path="/">
        {role === 'COACH' ? (
          <Redirect to="/coach/dashboard" />
        ) : role ? (
          <Redirect to="/athlete/home" />
        ) : (
          <Redirect to="/splash" />
        )}
      </Route>
    </IonRouterOutlet>
  );
};

export default AppRoutes;
