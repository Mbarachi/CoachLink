import React, { useEffect } from 'react';

import { Spinner } from '@/components/ui';
import { firebaseAuth } from '@/lib/firebase';
import { coachesService } from '@/services';
import { useAuthStore } from '@/store/auth.store';

/** Long enough for a slow connection, short enough that offline is not a dead end. */
const GIVE_UP_MS = 6000;

/**
 * Holds the app at launch until it knows whether a signed-in account is
 * partway through coach sign-up, but only when this phone has never asked.
 * Afterwards the answer is kept on the phone and every launch is instant.
 *
 * Sits above the router on purpose. Waiting inside Ionic's outlet meant
 * rendering something that was not a page, which stranded a spinner once and
 * looped forever the next time. Out here there is no outlet to upset: the
 * router simply is not drawn until the answer is in, and then it starts in
 * the right place.
 */
const BootGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);
  const pending = useAuthStore((s) => s.coachDraftPending);
  const emailVerified = useAuthStore((s) => s.emailVerified);
  const mustAsk = isAuthenticated && role !== 'COACH' && pending === null;
  // Same idea for the email: a phone updated from a build that never stored
  // it asks Firebase once, so the code-screen gate starts from the truth.
  const mustAskEmail = isAuthenticated && emailVerified === null;

  useEffect(() => {
    if (!mustAskEmail) return;
    let settled = false;
    const settle = (value: boolean) => {
      if (settled) return;
      settled = true;
      useAuthStore.getState().setEmailVerified(value);
    };
    // Offline: let them in rather than strand them. The server still refuses
    // an unconfirmed account at every point that matters.
    const timer = setTimeout(() => settle(true), GIVE_UP_MS);
    void firebaseAuth().authStateReady()
      .then(async () => {
        const current = firebaseAuth().currentUser;
        if (!current) return settle(true);   // signed out; useSessionWatch handles that
        await current.reload().catch(() => undefined);
        settle(current.emailVerified);
      })
      .catch(() => settle(true));
    return () => clearTimeout(timer);
  }, [mustAskEmail]);

  useEffect(() => {
    if (!mustAsk) return;
    let settled = false;
    const settle = (value: boolean) => {
      if (settled) return;
      settled = true;
      useAuthStore.getState().setCoachDraftPending(value);
    };
    // Offline or slow: let them in. The background check asks again next launch.
    const timer = setTimeout(() => settle(false), GIVE_UP_MS);
    void coachesService.getMyDraft()
      .then((draft) => settle(Boolean(draft)))
      .catch(() => settle(false));
    return () => clearTimeout(timer);
  }, [mustAsk]);

  if (mustAsk || mustAskEmail) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--cl-canvas)',
      }}>
        <Spinner size={26} />
      </div>
    );
  }
  return <>{children}</>;
};

export default BootGate;
