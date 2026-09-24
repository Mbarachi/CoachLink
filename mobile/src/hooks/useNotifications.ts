import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationsService } from '@/services';

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
