import axios from 'axios';

/** True only when the request never reached the server (backend down/unreachable). */
export function isBackendUnreachable(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

/** Extracts a user-facing message from a NestJS error response. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string | string[] } | undefined)?.message;
    if (Array.isArray(message)) return message.join(' ');
    if (typeof message === 'string') return message;
  }
  return fallback;
}
