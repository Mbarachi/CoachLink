/** Firebase surfaces failures as { code, message } rather than an HTTP shape. */
interface FirebaseLikeError {
  code?: string;
  message?: string;
}

const firebaseCode = (error: unknown): string | undefined => {
  const code = (error as FirebaseLikeError | undefined)?.code;
  return typeof code === 'string' ? code : undefined;
};

/** True only when the request never reached the server (backend down/unreachable). */
export function isBackendUnreachable(error: unknown): boolean {
  const code = firebaseCode(error);
  return code === 'unavailable' || code === 'auth/network-request-failed';
}

/**
 * A record that is not there.
 *
 * Carries the same `code` shape Firebase uses, so one check covers both a
 * missing document read directly and a callable that answers 'not-found'.
 * Worth a class of its own because the honest screen for it is different:
 * retrying will not bring back a booking that was deleted, and a notification
 * tapped weeks later is the ordinary way to arrive at one.
 */
export class NotFoundError extends Error {
  readonly code = 'not-found';

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export function isNotFound(error: unknown): boolean {
  return firebaseCode(error) === 'not-found';
}

/** True when the failure is the session, not the request — so the fix is signing in. */
export function isSignedOut(error: unknown): boolean {
  const code = firebaseCode(error);
  return code === 'unauthenticated' || code === 'auth/user-token-expired'
    || code === 'auth/user-disabled';
}

/** Extracts a user-facing message from a Firebase error. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const code = firebaseCode(error);
  if (code) {
    // Firebase's raw strings leak internals ("Firebase: Error (auth/...)"),
    // so the ones a user can actually act on are spelled out.
    const friendly: Record<string, string> = {
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/wrong-password': 'Invalid email or password.',
      'auth/user-not-found': 'Invalid email or password.',
      'auth/email-already-in-use': 'That email is already registered.',
      'auth/weak-password': 'Please choose a stronger password.',
      'auth/too-many-requests': 'Too many attempts. Try again shortly.',
      'permission-denied': 'You do not have access to this.',
      'unauthenticated': 'Please sign in again.',
    };
    if (friendly[code]) return friendly[code];
    const message = (error as FirebaseLikeError).message;
    if (message) return message.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/[^)]+\)\.?$/, '');
  }

  return fallback;
}
