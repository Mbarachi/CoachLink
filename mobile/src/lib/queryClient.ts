import { QueryClient } from '@tanstack/react-query';

import { isNotFound, isSignedOut } from './apiError';

/** Firebase surfaces a permissions failure as a code, not an HTTP status. */
const isPermanent = (error: unknown) =>
  isNotFound(error)
  || isSignedOut(error)
  || (error as { code?: string })?.code === 'permission-denied';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Retrying a booking that was deleted, or a screen the rules refuse,
      // only delays the honest answer. The check used to read an HTTP status
      // off an axios response, which nothing has returned since the Nest
      // backend was dropped — so every one of these was retried twice.
      retry: (failureCount, error: unknown) =>
        (isPermanent(error) ? false : failureCount < 2),
    },
    mutations: {
      retry: false,
    },
  },
});
