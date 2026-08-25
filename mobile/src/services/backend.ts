/**
 * Selects which backend the app talks to. Both implementations expose the
 * same function names and return the same shapes, so nothing above this file
 * — no page, no hook — knows which one is live.
 *
 *   VITE_BACKEND=nest      NestJS + Postgres (default)
 *   VITE_BACKEND=firebase  Firebase Auth + Firestore + Cloud Functions
 *
 * This is scaffolding for comparing the two, not permanent architecture.
 * Once one wins, delete the other and this file with it.
 */
export type BackendName = 'nest' | 'firebase';

export const BACKEND: BackendName =
  (import.meta.env.VITE_BACKEND as BackendName | undefined) ?? 'nest';

export const isFirebaseBackend = BACKEND === 'firebase';
