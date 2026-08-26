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

/** Extracts a user-facing message from a NestJS error response. */
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
