import React from 'react';
import { Redirect } from 'react-router-dom';

import { AppPage, LoadingState } from '@/components/ui';
import { useMyCoachProfile } from '@/hooks';
import { isNotFound } from '@/lib/apiError';

/**
 * Picking "coach" marks the account as one on the phone at once, but the
 * server only makes it one when the profile is submitted. Anyone who quit the
 * wizard in between would open straight onto a dashboard with nothing behind
 * it, so a coach with no profile goes back to finish it. Any other failure —
 * offline, say — lets them through: the screens already explain those.
 */
const CoachGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mine = useMyCoachProfile();

  // A cached "not found" from before the profile was submitted stays in place
  // while it refetches; treating that as an answer would bounce a coach who
  // has just finished straight back into the wizard.
  if (mine.isPending || (mine.isFetching && !mine.data)) return (
    // Inside a page: Ionic cannot leave a bare view, and redirecting away from
    // one strands the spinner on screen with the next page hidden behind it.
    <AppPage center><LoadingState /></AppPage>
  );
  if (isNotFound(mine.error)) return <Redirect to="/auth/coach-onboarding" />;
  return <>{children}</>;
};

export default CoachGate;
