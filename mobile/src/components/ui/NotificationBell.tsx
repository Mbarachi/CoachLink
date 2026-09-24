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
      {/* Drawn rather than approximated with a rounded box, which read as a
          square at any size. currentColor so it follows the theme, matching
          BackButton's chevron. */}
      <svg
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        aria-hidden="true" style={{ color: 'var(--cl-ink)' }}
      >
        <path
          d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M13.73 21a2 2 0 0 1-3.46 0"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

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
