import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { notificationsService } from '@/services';
import { useAuthStore } from '@/store/auth.store';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => ['notifications', 'list'] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationsService.list(),
    staleTime: 1000 * 30,
  });
}

/**
 * Derived from the same cached list the page renders, so the badge and the
 * screen can never disagree and the count costs no extra read.
 */
export function useUnreadCount(): number {
  const { data } = useNotifications();
  return (data ?? []).filter((n) => !n.isRead).length;
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => notificationsService.markAllRead(ids),
    onSuccess: () => void qc.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

/**
 * Keeps the cached list live for as long as the app is open. Mounted once, in
 * AppRoutes, so the bell is right on every screen rather than only on the one
 * that happens to have re-read.
 *
 * Writes into the same cache key useNotifications reads, so nothing else has
 * to know this exists.
 */
export function useNotificationsLive(): void {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;
    return notificationsService.subscribe(userId, (items) => {
      qc.setQueryData(notificationKeys.list(), items);
    });
  }, [qc, userId]);
}
