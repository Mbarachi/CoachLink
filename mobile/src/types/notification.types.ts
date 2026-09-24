export type NotificationType =
  | 'BOOKING_REQUEST'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_DECLINED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_REQUIRED'
  | 'BOOKING_CONFIRMED'
  | 'REVIEW_RECEIVED'
  | 'GENERAL';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  /** In-app path the row opens, or null when it is only an FYI. */
  link: string | null;
  createdAt: string;
}
