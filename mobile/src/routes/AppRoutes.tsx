import { IonRouterOutlet } from '@ionic/react';
import SearchCoachesPage from '@/pages/athlete/SearchCoachesPage';
import CoachListingPage from '@/pages/athlete/CoachListingPage';
import CoachDetailsPage from '@/pages/athlete/CoachDetailsPage';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute';
import CheckInboxPage from '@/pages/auth/CheckInboxPage';
import CoachOnboardingPage from '@/pages/auth/CoachOnboardingPage';
import CompleteProfilePage from '@/pages/auth/CompleteProfilePage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import OtpVerificationPage from '@/pages/auth/OtpVerificationPage';
import ResetPasswordSuccessPage from '@/pages/auth/ResetPasswordSuccessPage';
import RoleSelectionPage from '@/pages/auth/RoleSelectionPage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import SplashPage from '@/pages/auth/SplashPage';
import WelcomePage from '@/pages/auth/WelcomePage';
import { isFirebaseBackend } from '@/services';
import { useAuthStore } from '@/store/auth.store';

import AthleteRoutes from './AthleteRoutes';
import CoachRoutes from './CoachRoutes';

const AppRoutes: React.FC = () => {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <IonRouterOutlet id="main">
      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/splash" component={SplashPage} exact />
      <Route path="/athlete/search" component={SearchCoachesPage} exact />
      <Route path="/athlete/coaches" component={CoachListingPage} exact />
      <Route path="/athlete/coaches/:id" component={CoachDetailsPage} exact />
      <Route path="/welcome" component={WelcomePage} exact />
      <Route path="/auth/signin" component={SignInPage} exact />
      <Route path="/auth/signup" component={SignUpPage} exact />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} exact />
      {/* Firebase verifies by emailed link, so the code-entry screen is
          replaced rather than adapted. Same paths either way. */}
      <Route
        path="/auth/otp"
        render={() => (isFirebaseBackend
          ? <CheckInboxPage mode="verify" />
          : <OtpVerificationPage mode="signup" />)}
        exact
      />
      <Route
        path="/auth/forgot-password/otp"
        render={() => (isFirebaseBackend
          ? <CheckInboxPage mode="reset" />
          : <OtpVerificationPage mode="reset" />)}
        exact
      />
      <Route path="/auth/reset-success" component={ResetPasswordSuccessPage} exact />
      <Route path="/auth/role" component={RoleSelectionPage} exact />
      <Route path="/auth/complete-profile" component={CompleteProfilePage} exact />
      <Route path="/auth/coach-onboarding" component={CoachOnboardingPage} exact />

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
