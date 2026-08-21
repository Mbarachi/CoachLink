/**
 * The app only ever needs the `exp` claim, so this reads it directly rather
 * than pulling in a JWT library. Nothing here verifies the signature — the
 * server does that. This is only to avoid trusting a token we can already
 * see is stale.
 */

interface JwtPayload {
  exp?: number;
}

function decodeBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  // Payloads carry names and emails, so decode the bytes as UTF-8 rather than
  // treating atob's output as text.
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Expiry in epoch milliseconds, or null if the token has no usable `exp`. */
export function tokenExpiresAt(token: string): number | null {
  const payload = token.split('.')[1];
  if (!payload) return null;

  try {
    const { exp } = JSON.parse(decodeBase64Url(payload)) as JwtPayload;
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * A token we cannot read counts as expired: it is unusable either way, and
 * treating it as valid is what puts a signed-out user on a signed-in screen.
 *
 * `leewayMs` expires a token slightly early so a request started now doesn't
 * arrive after the server considers it dead.
 */
export function isTokenExpired(token: string | null | undefined, leewayMs = 10_000): boolean {
  if (!token) return true;
  const expiresAt = tokenExpiresAt(token);
  return expiresAt === null || expiresAt <= Date.now() + leewayMs;
}
