import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

/** Key shared with the no-flash bootstrap in index.html. Keep them in step. */
export const THEME_STORAGE_KEY = 'coachlink-theme';

const prefersDark = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-color-scheme: dark)').matches;

/** "system" is resolved here rather than in CSS, so variables.css needs one
 *  dark block instead of a prefers-color-scheme copy of every token. */
export const resolveTheme = (mode: ThemeMode): ResolvedTheme =>
  mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode;

const paint = (resolved: ResolvedTheme) => {
  document.documentElement.setAttribute('data-theme', resolved);
};

interface ThemeState {
  /** What the user chose. */
  mode: ThemeMode;
  /** What that currently means — what CSS is actually painting. */
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  /** Re-resolve after the OS flipped. A no-op unless mode is "system". */
  syncWithSystem: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolved: 'light',

      setMode: (mode) => {
        const resolved = resolveTheme(mode);
        paint(resolved);
        set({ mode, resolved });
      },

      syncWithSystem: () => {
        if (get().mode !== 'system') return;
        const resolved = resolveTheme('system');
        paint(resolved);
        set({ resolved });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only the choice is persisted. `resolved` is derived from it plus the
      // OS at boot, so storing it would let a stale value win over the truth.
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.resolved = resolveTheme(state.mode);
        paint(state.resolved);
      },
    },
  ),
);

/**
 * Starts watching the OS setting. Called once from main.tsx; the listener
 * lives as long as the app does, so there is nothing to tear down.
 *
 * `onResolve` fires on every effective change — including the first — which is
 * how the native status bar keeps up without the store importing Capacitor.
 */
export function initTheme(onResolve?: (resolved: ResolvedTheme) => void): void {
  const store = useThemeStore.getState();

  // Rehydration already painted if there was a stored choice; this covers a
  // first run, where mode is still the "system" default.
  const initial = resolveTheme(store.mode);
  paint(initial);
  if (store.resolved !== initial) useThemeStore.setState({ resolved: initial });

  if (onResolve) {
    onResolve(initial);
    useThemeStore.subscribe((s, prev) => {
      if (s.resolved !== prev.resolved) onResolve(s.resolved);
    });
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => useThemeStore.getState().syncWithSystem());
}
