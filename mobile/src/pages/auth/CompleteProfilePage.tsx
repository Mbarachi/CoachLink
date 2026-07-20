import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SPORTS = [
  { key: 'Swimming', emoji: '🏊' },
  { key: 'Tennis', emoji: '🎾' },
] as const;

const CompleteProfilePage: React.FC = () => {
  const history = useHistory();
  const [sport, setSport] = useState<'Swimming' | 'Tennis'>('Swimming');

  const finish = () => history.replace('/athlete/home');

  return (
    <IonPage>
      <IonContent style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 var(--cl-px-auth)', fontFamily: 'var(--cl-font-body)', minHeight: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
            <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
          </div>

          <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>
            What are you<br />training for?
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '0 0 22px' }}>
            Helps us show you the right coaches first. You can change this anytime.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            {SPORTS.map((s) => {
              const active = sport === s.key;
              return (
                <div
                  key={s.key}
                  onClick={() => setSport(s.key)}
                  style={{
                    flex: 1,
                    background: active ? 'var(--cl-ink)' : 'var(--cl-surface)',
                    border: active ? 'none' : '1px solid var(--cl-border)',
                    borderRadius: 18,
                    padding: 16,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 26 }}>{s.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: active ? 'var(--cl-surface)' : 'var(--cl-ink)', marginTop: 8 }}>{s.key}</div>
                </div>
              );
            })}
          </div>

          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', margin: '22px 0 7px', display: 'block' }}>Your location</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52, borderRadius: 14, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '0 15px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cl-accent)', flexShrink: 0 }} />
            <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cl-ink)' }}>Amuwo Odofin, Lagos</span>
          </div>

          <button
            onClick={finish}
            style={{ marginTop: 24, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)', background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          >
            Continue
          </button>
          <button
            onClick={finish}
            style={{ margin: '11px 0 22px', border: 'none', background: 'none', color: 'var(--cl-muted-1)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Skip for now
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CompleteProfilePage;
