import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

const Toggle: React.FC<{ on: boolean; onChange: () => void }> = ({ on, onChange }) => (
  <div onClick={onChange} style={{ width: 42, height: 24, borderRadius: 'var(--cl-radius-chip)', background: on ? 'var(--cl-accent)' : 'var(--cl-border)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .15s' }}>
    <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: 'var(--cl-surface)', transition: 'left .15s' }} />
  </div>
);

const Row: React.FC<{ label: string; onClick?: () => void; right?: React.ReactNode; last?: boolean }> = ({ label, onClick, right, last }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', padding: '14px 15px', borderBottom: last ? 'none' : '1px solid var(--cl-subtle)', cursor: onClick ? 'pointer' : 'default' }}>
    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cl-ink)' }}>{label}</span>
    {right ?? (onClick && <span style={{ color: 'var(--cl-muted-line)' }}>›</span>)}
  </div>
);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em', color: 'var(--cl-muted-2)', margin: '6px 0 8px' }}>{text}</div>
);

const CoachSettingsPage: React.FC = () => {
  const history = useHistory();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [push, setPush]     = useState(true);
  const [email, setEmail]   = useState(false);
  const [remind, setRemind] = useState(true);

  const handleLogout = () => {
    clearAuth();
    history.replace('/welcome');
  };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ flexShrink: 0, padding: '0 var(--cl-px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 14px' }}>Settings</h1>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--cl-px) 22px' }}>
            <SectionLabel text="ACCOUNT" />
            <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
              <Row label="Edit profile" onClick={() => history.push('/coach/profile')} />
              <Row label="Email & password" />
              <Row label="Payout account" last />
            </div>

            <SectionLabel text="PREFERENCES" />
            <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
              <Row label="Push notifications" right={<Toggle on={push} onChange={() => setPush(!push)} />} />
              <Row label="Email updates" right={<Toggle on={email} onChange={() => setEmail(!email)} />} />
              <Row label="New request alerts" right={<Toggle on={remind} onChange={() => setRemind(!remind)} />} last />
            </div>

            <SectionLabel text="SUPPORT" />
            <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
              <Row label="Help & FAQ" />
              <Row label="Privacy & terms" last />
            </div>

            <button onClick={handleLogout} style={{ width: '100%', height: 52, border: '1px solid var(--cl-border)', borderRadius: 15, background: 'var(--cl-surface)', color: 'var(--cl-destructive)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}>
              Log out
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CoachSettingsPage;
