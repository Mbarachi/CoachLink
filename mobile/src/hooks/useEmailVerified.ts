import { App } from '@capacitor/app';
import { useCallback, useEffect, useState } from 'react';

import { firebaseAuth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth.store';

/**
 * Whether the signed-in address is confirmed, straight from Firebase Auth.
 *
 * Verification happens out of band — the user opens a link in a mail client —
 * so this session never hears about it. Re-checking when the app returns to
 * the foreground is what makes the banner disappear on its own.
 */
export function useEmailVerified(): { verified: boolean; recheck: () => Promise<void> } {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [verified, setVerified] = useState(true); // assume fine until told otherwise, so nothing flashes

  const recheck = useCallback(async () => {
    const current = firebaseAuth().currentUser;
    if (!current) return;
    try {
      await current.reload();
      setVerified(current.emailVerified);
      updateUser({ isVerified: current.emailVerified });
    } catch {
      // Offline — leave the last known answer rather than nagging wrongly.
    }
  }, [updateUser]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void recheck();

    const resume = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) void recheck();
    });
    const onVisible = () => {
      if (document.visibilityState === 'visible') void recheck();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      void resume.then((l) => l.remove());
    };
  }, [isAuthenticated, recheck]);

  return { verified, recheck };
}
