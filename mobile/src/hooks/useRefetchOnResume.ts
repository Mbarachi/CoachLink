import { App } from '@capacitor/app';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

/**
 * Refetches when the app is brought back to the foreground.
 *
 * Covers far more staleness than the pull gesture does: most out-of-date data
 * on a phone comes from putting the app down and picking it up an hour later,
 * and nobody thinks to pull in that moment — they just read what is on screen
 * and believe it.
 *
 * Scoped to active queries, so it refreshes the screen actually being looked
 * at rather than every cache the session has ever filled.
 */
export function useRefetchOnResume(): void {
  const qc = useQueryClient();

  useEffect(() => {
    const listener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) void qc.invalidateQueries({ refetchType: 'active' });
    });
    return () => { void listener.then((l) => l.remove()); };
  }, [qc]);
}
