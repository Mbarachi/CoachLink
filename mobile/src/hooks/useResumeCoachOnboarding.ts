import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { coachesService } from '@/services';
import { useAuthStore } from '@/store/auth.store';

/**
 * On launch, sends someone who is partway through becoming a coach back into
 * the wizard instead of the athlete home they would otherwise land on.
 *
 * A side effect rather than a route guard on purpose. A guard has to render
 * something while it asks the server, and anything it renders inside Ionic's
 * outlet that is not the page itself either strands a spinner or remounts in
 * a loop — both of which shipped. Here the app renders as normal and simply
 * moves once the answer is in.
 *
 * The startup redirect normally gets there first, from the hint the phone
 * keeps; this is the backstop for when that hint is missing or out of date.
 *
 * Runs once per launch. Sign-in makes the same check itself, before choosing
 * where to go, so it never shows the athlete home first.
 */
export function useResumeCoachOnboarding(): void {
  const history = useHistory();

  useEffect(() => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role === 'COACH') return;

    let cancelled = false;
    void coachesService.getMyDraft()
      .then((draft) => {
        if (cancelled) return;
        // Keeps the phone's hint in step with the server, which wins: a draft
        // finished or abandoned on another phone stops sending this one back.
        useAuthStore.getState().setCoachDraftPending(Boolean(draft));
        if (!draft) return;
        // Only from the athlete side: never pull someone off the role screen,
        // out of sign-up, or out of the wizard itself.
        if (history.location.pathname.startsWith('/athlete')) {
          history.replace('/auth/coach-onboarding');
        }
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [history]);
}
