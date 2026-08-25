import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { queryClient } from '@/lib/queryClient';
import { isTokenExpired } from '@/lib/token';
import { isFirebaseBackend } from '@/services/backend';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

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
        set({ user: null, accessToken: null, isAuthenticated: false });
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
      }),
      /**
       * On iOS this state comes back from WKWebView storage that survives the
       * app being killed, so a week-old token would otherwise restore as a
       * signed-in session — the app would render the home screen, fire a
       * request, take a 401 and only then eject the user. Checking here means
       * an expired session never reaches the UI at all.
       */
      onRehydrateStorage: () => (state) => {
        if (!state?.isAuthenticated) return;

        // Firebase mints one-hour ID tokens and silently refreshes them, so
        // the stored copy is stale by design and expiring on it would sign the
        // user out every hour. The SDK owns session validity there; this check
        // is only meaningful for the Nest backend's seven-day tokens.
        if (isFirebaseBackend) return;

        if (isTokenExpired(state.accessToken)) {
          state.clearAuth();
        }
      },
    },
  ),
);
