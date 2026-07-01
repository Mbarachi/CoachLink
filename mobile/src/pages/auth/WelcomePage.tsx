import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 var(--cl-px-auth)', fontFamily: 'var(--cl-font-body)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
            <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: 'var(--cl-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--cl-accent)' }} />
            </div>
            <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 20, color: 'var(--cl-ink)', letterSpacing: '-0.03em' }}>CoachLink</span>
          </div>

          <div style={{
            marginTop: 22, borderRadius: 26, height: 316, flexShrink: 0,
            backgroundImage: 'repeating-linear-gradient(125deg, #E7D7C2 0 13px, #EFE3D3 13px 26px)',
            border: '1px solid var(--cl-border)',
            display: 'flex', alignItems: 'flex-end', padding: 16, overflow: 'hidden',
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--cl-muted-2)', background: 'var(--cl-surface)', padding: '4px 9px', borderRadius: 7 }}>
              athlete · hero photo
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 37, lineHeight: 1.02, letterSpacing: '-0.035em', color: 'var(--cl-ink)', margin: '18px 0 0' }}>
            Find your coach.<br />Train with intent.
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '13px 0 0' }}>
            Verified swimming &amp; tennis coaches in Amuwo Odofin. Book by the session, train near home.
          </p>

          <button onClick={() => history.push('/auth/signup')} style={{
            marginTop: 20, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)',
            background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
            fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
          }}>Create an account</button>

          <button onClick={() => history.push('/auth/signin')} style={{
            margin: '11px 0 22px', border: 'none', background: 'none',
            color: 'var(--cl-ink)', fontWeight: 600, fontSize: 14,
            cursor: 'pointer', fontFamily: 'var(--cl-font-body)',
          }}>I already have an account</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
