export type NotificationType =
  | 'BOOKING_REQUEST'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_DECLINED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_REQUIRED'
  | 'BOOKING_CONFIRMED'
  | 'GENERAL';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
