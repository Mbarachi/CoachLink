import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { queryClient } from '@/lib/queryClient';
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
      // No expiry check here: Firebase mints one-hour ID tokens and refreshes
      // them silently, so the persisted copy is stale by design. onAuthStateChanged
      // is what actually decides whether a session is live.
    },
  ),
);
