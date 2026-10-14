import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { queryClient } from '@/lib/queryClient';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  /**
   * This phone's memory that the account is partway through coach sign-up.
   * The server's coachDrafts document is the truth; this copy exists so a
   * cold start can open the wizard straight away instead of flashing the
   * athlete home while it asks. Null means this phone has not asked yet, which
   * is when BootGate holds the app until the server answers.
   */
  coachDraftPending: boolean | null;
  /**
   * Whether the account's email is confirmed, as last known on this phone.
   * Every account must confirm before using the app, and the routes read this
   * to hold an unconfirmed one at the code screen. Null means not known yet,
   * which BootGate settles by asking Firebase.
   */
  emailVerified: boolean | null;

  setEmailVerified: (verified: boolean) => void;

  setCoachDraftPending: (pending: boolean) => void;
  setAuth: (user: User, token: string, emailVerified: boolean) => void;
  updateUser: (partial: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      coachDraftPending: null,
      emailVerified: null,

      setEmailVerified: (emailVerified) => set({ emailVerified }),

      setCoachDraftPending: (coachDraftPending) => set({ coachDraftPending }),

      setAuth: (user, accessToken, emailVerified) => {
        // Drop anything cached for whoever was signed in before, so a new
        // account never renders the previous one's bookings or profile.
        queryClient.clear();
        // A fresh session starts from "not mid coach sign-up": true for a new
        // account, and sign-in asks the server before it navigates anywhere.
        // Null here would hold the whole app behind BootGate mid sign-up.
        set({ user, accessToken, isAuthenticated: true, coachDraftPending: false, emailVerified });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : state.user,
        })),

      clearAuth: () => {
        queryClient.clear();
        set({ user: null, accessToken: null, isAuthenticated: false, coachDraftPending: null, emailVerified: null });
      },
    }),
    {
      name: 'coachlink-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist the token + user, not derived flags
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        coachDraftPending: state.coachDraftPending,
        emailVerified: state.emailVerified,
      }),
      // No expiry check here: Firebase mints one-hour ID tokens and refreshes
      // them silently, so the persisted copy is stale by design. onAuthStateChanged
      // is what actually decides whether a session is live.
    },
  ),
);
