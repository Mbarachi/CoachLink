import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const NOTIFS = [
  { icon: '✓', iconBg: 'var(--cl-accent)', iconColor: 'var(--cl-on-accent)', title: 'Request accepted', body: 'Tobi Adebayo accepted your request. Tap to complete payment.', time: '2m', unread: true, border: 'var(--cl-ink)', action: '/athlete/payment/0' },
  { icon: '💳', iconBg: 'var(--cl-subtle)', iconColor: '', title: 'Payment confirmed', body: 'Your booking with Chidinma Okafor is confirmed for Fri, 17 May.', time: '1h', unread: true, border: 'var(--cl-border)', action: null },
  { icon: '⭐', iconBg: 'var(--cl-subtle)', iconColor: '', title: 'Leave a review', body: 'How was your session with Emeka Johnson? Share your feedback.', time: '1d', unread: false, border: 'var(--cl-border)', action: null },
  { icon: '⏰', iconBg: 'var(--cl-subtle)', iconColor: '', title: 'Session reminder', body: 'Your swimming session is tomorrow at 8:00 AM, Festival Hotel Pool.', time: '2d', unread: false, border: 'var(--cl-border)', action: null },
];

const NotificationsPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ padding: '0 var(--cl-px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 6px' }}>
              <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: 0 }}>Notifications</h1>
              <span style={{ fontSize: 12.5, color: 'var(--cl-ink)', fontWeight: 600, cursor: 'pointer' }}>Mark all read</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px var(--cl-px) 12px' }}>
            {NOTIFS.map((n, i) => (
              <div key={i} onClick={() => n.action && history.push(n.action)} style={{ display: 'flex', gap: 13, padding: 14, borderRadius: 16, background: 'var(--cl-surface)', border: `1px solid ${n.border}`, marginBottom: 10, cursor: n.action ? 'pointer' : 'default' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: n.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: n.iconColor || 'inherit', flexShrink: 0 }}>{n.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{n.title}</span>
                    {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cl-accent)', display: 'block', flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)', margin: '3px 0 0' }}>{n.body}</p>
                </div>
                <span style={{ fontSize: 11, color: 'var(--cl-muted-2)', flexShrink: 0 }}>{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
