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
        if (user.role === 'COACH') {
          history.replace('/coach/dashboard');
        } else {
          history.replace('/athlete/home');
        }
      } else {
        history.replace('/welcome');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, history]);

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-primary)' } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 16,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="3" />
              <path
                d="M14 24 C14 18 19 14 24 14 C29 14 34 18 34 24"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="24" cy="31" r="5" fill="white" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 32,
              color: '#fff',
              margin: 0,
            }}
          >
            CoachLink
          </h1>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              margin: 0,
            }}
          >
            Find the right coach. Train better.
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashPage;
