import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppPage, EmptyState, PageBody, PageTitle, QueryState } from '@/components/ui';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks';
import { formatRelativeTime } from '@/lib/format';
import type { Notification, NotificationType } from '@/types';

/** A glyph rather than an icon set: one character reads at 16px and ships nothing. */
const GLYPHS: Record<NotificationType, string> = {
  BOOKING_REQUEST: '!',
  BOOKING_ACCEPTED: '✓',
  BOOKING_DECLINED: '×',
  BOOKING_CONFIRMED: '✓',
  PAYMENT_RECEIVED: '₦',
  PAYMENT_REQUIRED: '₦',
  REVIEW_RECEIVED: '★',
  GENERAL: '!',
};

/** Only the row that wants money spent earns the accent tile. */
const isActionable = (n: Notification) => n.type === 'BOOKING_ACCEPTED';

const NotificationsPage: React.FC = () => {
  const history = useHistory();
  const query = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const items = query.data ?? [];
  const hasUnread = items.some((n) => !n.isRead);

  const open = (n: Notification) => {
    // Marked read optimistically in effect — the navigation matters more than
    // the write, and a failed write leaves a dot, not a broken screen.
    if (!n.isRead) markRead.mutate(n.id);
    if (n.link) history.push(n.link);
  };

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <PageTitle>Notifications</PageTitle>
        {hasUnread && (
          <span
            onClick={() => markAllRead.mutate()}
            style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', cursor: 'pointer' }}
          >
            Mark all read
          </span>
        )}
      </div>

      <PageBody>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {items.length === 0 ? (
            <EmptyState
              illustration="notifications"
              title="No notifications"
              message="You’ll be notified here when a coach responds to one of your requests."
            />
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                onClick={() => open(n)}
                style={{
                  display: 'flex', gap: 13, padding: 14, marginBottom: 10,
                  borderRadius: 16, background: 'var(--cl-surface)',
                  // An unread row is outlined in ink rather than tinted, so the
                  // distinction survives both themes without a second colour.
                  border: `1px solid ${n.isRead ? 'var(--cl-border)' : 'var(--cl-ink)'}`,
                  cursor: n.link ? 'pointer' : 'default',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700,
                  background: isActionable(n) ? 'var(--cl-accent)' : 'var(--cl-subtle)',
                  // A star is gold wherever it appears, including here.
                  color: n.type === 'REVIEW_RECEIVED'
                    ? 'var(--cl-star)'
                    : isActionable(n) ? 'var(--cl-on-accent)' : 'var(--cl-ink)',
                }}>{GLYPHS[n.type] ?? '!'}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{n.title}</span>
                    {!n.isRead && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cl-accent)', flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)', margin: '3px 0 0' }}>
                    {n.message}
                  </p>
                </div>

                <span style={{ fontSize: 11, color: 'var(--cl-muted-2)', flexShrink: 0 }}>
                  {formatRelativeTime(n.createdAt)}
                </span>
              </div>
            ))
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default NotificationsPage;
