import { IonContent, IonPage } from '@ionic/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

const SplashPage: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        history.replace(user.role === 'COACH' ? '/coach/dashboard' : '/athlete/home');
      } else {
        history.replace('/welcome');
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, history]);

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-ink)' } as React.CSSProperties}>
        <div style={{
          height: '100%',
          background: 'var(--cl-ink)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* radial glow */}
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(225,98,60,.22), transparent 68%)',
            pointerEvents: 'none',
          }} />

          {/* brand mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'var(--cl-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ width: 19, height: 19, borderRadius: '50%', background: 'var(--cl-ink)' }} />
            </div>
            <span style={{
              fontFamily: 'var(--cl-font-display)',
              fontWeight: 800,
              fontSize: 32,
              color: 'var(--cl-canvas)',
              letterSpacing: '-0.03em',
            }}>CoachLink</span>
          </div>

          <span style={{
            position: 'absolute',
            bottom: 54,
            fontSize: 13,
            color: 'var(--cl-muted-2)',
            fontFamily: 'var(--cl-font-body)',
          }}>Tap to continue</span>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashPage;
