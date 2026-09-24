import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

import { firebaseAuth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

/**
 * Keeps the app's idea of "signed in" tied to Firebase's.
 *
 * The store persists to localStorage, so it survives a session Firebase has
 * ended — a revoked token, a deleted account, a password changed elsewhere.
 * Without this the app renders every protected screen for a user who can read
 * nothing, and each one reports "Something went wrong" rather than the truth,
 * which is that they are signed out.
 *
 * Only clears; signing in is still the sign-in screen's job, because that is
 * where the profile is loaded and the role decided.
 */
export function useSessionWatch(): void {
  useEffect(() => {
    return onAuthStateChanged(firebaseAuth(), (user) => {
      if (user) return;

      const { isAuthenticated, clearAuth } = useAuthStore.getState();
      // Already signed out, or never signed in: nothing to say.
      if (!isAuthenticated) return;

      clearAuth();
      useUiStore.getState().showToast('Your session ended. Please sign in again.', 'danger');
    });
  }, []);
}
