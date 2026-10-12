import { useEffect } from 'react';

import { coachesService } from '@/services';
import { useAuthStore } from '@/store/auth.store';

/**
 * Re-asks the server on every launch whether the account is partway through
 * coach sign-up, and keeps the phone's answer in step with it. The server
 * wins: a sign-up finished or abandoned on another phone stops this one
 * sending them back, and one started elsewhere starts doing so.
 *
 * Moving the user is not done here. The athlete routes are closed while the
 * answer is yes (ProtectedRoute), so flipping it is enough. BootGate covers
 * the first launch, when the phone has no answer to start from.
 */
export function useResumeCoachOnboarding(): void {
  useEffect(() => {
    const { isAuthenticated, user, coachDraftPending } = useAuthStore.getState();
    // BootGate is already asking when there is no answer yet.
    if (!isAuthenticated || user?.role === 'COACH' || coachDraftPending === null) return;

    let cancelled = false;
    void coachesService.getMyDraft()
      .then((draft) => {
        if (!cancelled) useAuthStore.getState().setCoachDraftPending(Boolean(draft));
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);
}
