import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const name = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Ada Obi' : 'Ada Obi';
  const email = user?.email ?? 'ada@example.com';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AO';
  const roleLabel = user?.role === 'PARENT' ? 'Parent' : 'Athlete';

  const menuItems = [
    { label: 'My bookings',      action: () => history.push('/athlete/bookings') },
    { label: 'Payment methods',  action: () => {} },
    { label: 'Notifications',    action: () => history.push('/athlete/notifications') },
    { label: 'Settings',         action: () => history.push('/athlete/settings') },
  ];

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '0 var(--cl-px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
                <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 18px' }}>
                <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: 0 }}>Profile</h1>
                <button onClick={() => history.push('/athlete/settings')} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 16, cursor: 'pointer' }}>⚙</button>
              </div>

              {/* avatar + info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ width: 66, height: 66, borderRadius: 20, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 24, flexShrink: 0 }}>{initials}</div>
                <div>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>{email}</div>
                  <span style={{ display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 700, color: 'var(--cl-on-accent)', background: 'var(--cl-accent)', padding: '3px 10px', borderRadius: 'var(--cl-radius-chip)' }}>{roleLabel}</span>
                </div>
              </div>

              {/* stat tiles */}
              <div style={{ display: 'flex', gap: 9, marginTop: 18 }}>
                {[{ val: '8', label: 'Sessions' }, { val: '3', label: 'Coaches' }, { val: '5', label: 'Reviews' }].map(s => (
                  <div key={s.label} style={{ flex: 1, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 15, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 20, color: 'var(--cl-ink)' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--cl-muted-1)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* menu list */}
              <div style={{ marginTop: 20, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 18, overflow: 'hidden' }}>
                {menuItems.map((item, i) => (
                  <div key={item.label} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 15, borderBottom: i < menuItems.length - 1 ? '1px solid var(--cl-subtle)' : 'none', cursor: 'pointer' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--cl-subtle)', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cl-ink)' }}>{item.label}</span>
                    <span style={{ color: 'var(--cl-muted-line)' }}>›</span>
                  </div>
                ))}
              </div>

              {/* switch to coach view */}
              <div onClick={() => history.push('/coach/dashboard')} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 11, background: 'var(--cl-ink)', borderRadius: 16, padding: 15, cursor: 'pointer' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--cl-accent)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--cl-surface)' }}>Switch to coach view</span>
                <span style={{ color: 'var(--cl-accent)' }}>›</span>
              </div>

              <div style={{ height: 96 }} />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
