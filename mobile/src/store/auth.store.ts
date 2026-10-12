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
   * athlete home while it asks.
   */
  coachDraftPending: boolean;

  setCoachDraftPending: (pending: boolean) => void;
  setAuth: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      coachDraftPending: false,

      setCoachDraftPending: (coachDraftPending) => set({ coachDraftPending }),

      setAuth: (user, accessToken) => {
        // Drop anything cached for whoever was signed in before, so a new
        // account never renders the previous one's bookings or profile.
        queryClient.clear();
        set({ user, accessToken, isAuthenticated: true });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : state.user,
        })),

      clearAuth: () => {
        queryClient.clear();
        set({ user: null, accessToken: null, isAuthenticated: false, coachDraftPending: false });
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
      }),
      // No expiry check here: Firebase mints one-hour ID tokens and refreshes
      // them silently, so the persisted copy is stale by design. onAuthStateChanged
      // is what actually decides whether a session is live.
    },
  ),
);
