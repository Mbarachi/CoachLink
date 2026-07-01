import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

const roles = [
  {
    key: 'athlete',
    label: "I'm an athlete",
    sub: 'Find a coach and book my own sessions.',
    initial: 'A',
    iconBg: 'var(--cl-ink)',
    iconColor: 'var(--cl-accent)',
    border: '1.6px solid var(--cl-ink)',
    chevronColor: 'var(--cl-ink)',
    dest: '/athlete/home',
  },
  {
    key: 'parent',
    label: "I'm a parent",
    sub: 'Book sessions for my child.',
    initial: 'P',
    iconBg: 'var(--cl-subtle)',
    iconColor: 'var(--cl-ink)',
    border: '1px solid var(--cl-border)',
    chevronColor: 'var(--cl-muted-1)',
    dest: '/athlete/home',
  },
  {
    key: 'coach',
    label: "I'm a coach",
    sub: 'List my profile and accept bookings.',
    initial: 'C',
    iconBg: 'var(--cl-accent)',
    iconColor: 'var(--cl-on-accent)',
    border: '1px solid var(--cl-border)',
    chevronColor: 'var(--cl-muted-1)',
    dest: '/coach/dashboard',
  },
];

const RoleSelectionPage: React.FC = () => {
  const history = useHistory();
  const updateUser = useAuthStore((s) => s.updateUser);

  const pick = (r: typeof roles[0]) => {
    updateUser({ role: r.key.toUpperCase() as any });
    history.replace(r.dest);
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 var(--cl-px-auth)', fontFamily: 'var(--cl-font-body)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
            <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
          </div>

          <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '30px 0 6px' }}>
            How will you<br />use CoachLink?
          </h1>
          <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 26px' }}>You can change this later in settings.</p>

          {roles.map((r) => (
            <div
              key={r.key}
              onClick={() => pick(r)}
              style={{
                display: 'flex', alignItems: 'center', gap: 15,
                background: 'var(--cl-surface)', border: r.border,
                borderRadius: 20, padding: 18, cursor: 'pointer', marginBottom: 13,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: r.iconBg, color: r.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 20,
              }}>{r.initial}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)' }}>{r.label}</div>
                <div style={{ fontSize: 13, color: 'var(--cl-muted-1)', marginTop: 2 }}>{r.sub}</div>
              </div>
              <span style={{ fontSize: 20, color: r.chevronColor }}>›</span>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RoleSelectionPage;
