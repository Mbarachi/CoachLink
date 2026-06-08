import api from './api';
import type { Notification } from '@/types';

export const notificationsService = {
  list: () =>
    api.get<Notification[]>('/notifications').then((r) => r.data),

  markAsRead: (id: string) =>
    api.patch<Notification>(`/notifications/${id}/read`).then((r) => r.data),
};
