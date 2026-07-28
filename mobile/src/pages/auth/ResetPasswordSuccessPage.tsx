import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const ResetPasswordSuccessPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 34px', fontFamily: 'var(--cl-font-body)' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, color: 'var(--cl-on-accent)' }}>✓</div>
          <h2 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 27, letterSpacing: '-0.02em', color: 'var(--cl-ink)', margin: '26px 0 10px' }}>Password reset</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: 0 }}>
            Your password has been reset successfully. Sign in with your new password to continue.
          </p>
          <button onClick={() => history.replace('/auth/signin')} style={{ marginTop: 30, width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-ink)', color: 'var(--cl-surface)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>
            Back to sign in
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPasswordSuccessPage;
