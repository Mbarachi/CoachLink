import { IonRouterOutlet } from '@ionic/react';
import SearchCoachesPage from '@/pages/athlete/SearchCoachesPage';
import CoachDetailsPage from '@/pages/athlete/CoachDetailsPage';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute';
import CheckInboxPage from '@/pages/auth/CheckInboxPage';
import HelpPage from '@/pages/legal/HelpPage';
import LegalPage from '@/pages/legal/LegalPage';
import CoachOnboardingPage from '@/pages/auth/CoachOnboardingPage';
import CompleteProfilePage from '@/pages/auth/CompleteProfilePage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordSuccessPage from '@/pages/auth/ResetPasswordSuccessPage';
import RoleSelectionPage from '@/pages/auth/RoleSelectionPage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import SplashPage from '@/pages/auth/SplashPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import WelcomePage from '@/pages/auth/WelcomePage';
import {
  useAndroidBackButton, useNotificationsLive, usePushNavigator, useRefetchOnResume,
  useResumeCoachOnboarding, useSessionWatch,
} from '@/hooks';
import { useAuthStore } from '@/store/auth.store';

import AthleteRoutes from './AthleteRoutes';
import CoachRoutes from './CoachRoutes';

const AppRoutes: React.FC = () => {
  const role = useAuthStore((s) => s.user?.role);
  const coachDraftPending = useAuthStore((s) => s.coachDraftPending);
  const emailVerified = useAuthStore((s) => s.emailVerified);

  // A session Firebase has ended must not leave the app pretending otherwise.
  useSessionWatch();

  // Android's hardware back button, which otherwise walks raw webview history.
  useAndroidBackButton();

  // Lets a tapped push notification reach the screen it names.
  usePushNavigator();

  // Keeps the bell honest without anything having to re-read.
  useNotificationsLive();

  // Most stale data comes from putting the phone down, not from not pulling.
  useRefetchOnResume();

  // A coach who closed the app halfway through sign-up goes back to finish it.
  useResumeCoachOnboarding();

  return (
    <IonRouterOutlet id="main">
      {/* ── Public ─────────────────────────────────────────── */}
      <Route path="/splash" component={SplashPage} exact />
      <Route path="/athlete/search" component={SearchCoachesPage} exact />
      <Route exact path="/athlete/coaches"><Redirect to="/athlete/search" /></Route>
      <Route path="/athlete/coaches/:id" component={CoachDetailsPage} exact />
      <Route path="/welcome" component={WelcomePage} exact />
      {/* Public: the App Store needs a reachable privacy policy, and someone
          deciding whether to sign up should be able to read it first. */}
      <Route path="/help" component={HelpPage} exact />
      <Route path="/legal" component={LegalPage} exact />
      <Route path="/auth/signin" component={SignInPage} exact />
      <Route path="/auth/signup" component={SignUpPage} exact />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} exact />
      {/* Email is confirmed by a 6-digit code sent through Resend. Password
          reset still goes by Firebase's emailed link, hence the inbox screen. */}
      <Route path="/auth/otp" component={VerifyEmailPage} exact />
      <Route path="/auth/forgot-password/otp" render={() => <CheckInboxPage mode="reset" />} exact />
      <Route path="/auth/reset-success" component={ResetPasswordSuccessPage} exact />
      <Route path="/auth/role" component={RoleSelectionPage} exact />
      <Route path="/auth/complete-profile" component={CompleteProfilePage} exact />
      <Route path="/auth/coach-onboarding" component={CoachOnboardingPage} exact />

      {/* ── Protected: Athlete / Parent ────────────────────── */}
      <ProtectedRoute
        path="/athlete"
        component={AthleteRoutes}
        roles={['ATHLETE', 'PARENT']}
        closedDuringCoachSignup
      />

      {/* ── Protected: Coach ───────────────────────────────── */}
      <ProtectedRoute path="/coach" component={CoachRoutes} roles={['COACH']} />

      {/* ── Default redirect ───────────────────────────────── */}
      <Route exact path="/">
        {role && emailVerified === false ? (
          // Not confirmed yet: the code screen, then back here to be routed.
          <Redirect to={{ pathname: '/auth/otp', state: { send: true, next: '/' } }} />
        ) : role === 'COACH' ? (
          <Redirect to="/coach/dashboard" />
        ) : role && coachDraftPending === true ? (
          // Partway through coach sign-up: straight back to it, no detour home.
          <Redirect to="/auth/coach-onboarding" />
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
