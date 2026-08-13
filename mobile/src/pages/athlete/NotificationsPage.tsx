import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, PageBody, PageTitle, StatusBar } from '@/components/ui';

const NOTIFS = [
  { icon: '✓', iconBg: 'var(--cl-accent)', iconColor: 'var(--cl-on-accent)', title: 'Request accepted', body: 'Tobi Adebayo accepted your request. Tap to complete payment.', time: '2m', unread: true, border: 'var(--cl-ink)', action: '/athlete/payment/0' },
  { icon: '💳', iconBg: 'var(--cl-subtle)', iconColor: '', title: 'Payment confirmed', body: 'Your booking with Chidinma Okafor is confirmed for Fri, 17 May.', time: '1h', unread: true, border: 'var(--cl-border)', action: null },
  { icon: '⭐', iconBg: 'var(--cl-subtle)', iconColor: '', title: 'Leave a review', body: 'How was your session with Emeka Johnson? Share your feedback.', time: '1d', unread: false, border: 'var(--cl-border)', action: null },
  { icon: '⏰', iconBg: 'var(--cl-subtle)', iconColor: '', title: 'Session reminder', body: 'Your swimming session is tomorrow at 8:00 AM, Festival Hotel Pool.', time: '2d', unread: false, border: 'var(--cl-border)', action: null },
];

const NotificationsPage: React.FC = () => {
  const history = useHistory();

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 6px' }}>
          <PageTitle style={{ margin: 0 }}>Notifications</PageTitle>
          <span style={{ fontSize: 12.5, color: 'var(--cl-ink)', fontWeight: 600, cursor: 'pointer' }}>Mark all read</span>
        </div>
      </div>

      <PageBody style={{ paddingTop: 10 }}>
        {NOTIFS.map((n, i) => (
          <AppCard
            key={i}
            onClick={n.action ? () => history.push(n.action!) : undefined}
            padding={14}
            style={{ display: 'flex', gap: 13, borderRadius: 16, border: `1px solid ${n.border}`, marginBottom: 10 }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: n.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: n.iconColor || 'inherit', flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{n.title}</span>
                {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cl-accent)', display: 'block', flexShrink: 0 }} />}
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)', margin: '3px 0 0' }}>{n.body}</p>
            </div>
            <span style={{ fontSize: 11, color: 'var(--cl-muted-2)', flexShrink: 0 }}>{n.time}</span>
          </AppCard>
        ))}
      </PageBody>
    </AppPage>
  );
};

export default NotificationsPage;
