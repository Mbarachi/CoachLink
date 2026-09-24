import React from 'react';

import { useUnreadCount } from '@/hooks';

interface NotificationBellProps {
  onClick: () => void;
}

/**
 * The single place an unread count appears, for both roles.
 *
 * Shared rather than written twice because the two roles had drifted already —
 * the athlete carried a tab and a bell, the coach only a bell. One component
 * means they cannot disagree again.
 *
 * Capped at 9+: the badge sits inside a 40px control, and the exact number
 * stops mattering long before it stops fitting.
 */
const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const unread = useUnreadCount();

  return (
    <div
      onClick={onClick}
      role="button"
      aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
      style={{
        width: 40, height: 40, borderRadius: 13, flexShrink: 0,
        border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', cursor: 'pointer',
      }}
    >
      <div style={{
        width: 14, height: 14,
        border: '1.8px solid var(--cl-ink)', borderRadius: '4px 4px 7px 7px',
      }} />

      {unread > 0 && (
        <span style={{
          position: 'absolute', top: -5, right: -5,
          minWidth: 18, height: 18, padding: '0 5px',
          borderRadius: 'var(--cl-radius-chip)',
          background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
          border: '2px solid var(--cl-canvas)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--cl-font-body)', fontSize: 10, fontWeight: 700,
          lineHeight: 1, boxSizing: 'border-box',
        }}>
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
