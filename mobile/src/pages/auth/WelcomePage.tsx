import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import AppButton from '@/components/ui/AppButton';

const WelcomePage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '0 24px 40px',
          }}
        >
          {/* Illustration area */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 30,
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--cl-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
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
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: 26,
                  color: 'var(--cl-secondary)',
                }}
              >
                CoachLink
              </span>
            </div>

            {/* Illustration placeholder */}
            <div
              style={{
                width: '100%',
                maxWidth: 300,
                height: 220,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #e8f8f0 0%, #d0f0e0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 36,
                overflow: 'hidden',
              }}
            >
              {/* Simple sports illustration */}
              <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                {/* Ground */}
                <ellipse cx="80" cy="140" rx="60" ry="8" fill="#b2e8c8" opacity="0.6" />
                {/* Person 1 - running */}
                <circle cx="50" cy="55" r="12" fill="#6FCF97" />
                <rect x="44" y="67" width="12" height="28" rx="6" fill="#6FCF97" />
                <line x1="44" y1="80" x2="35" y2="95" stroke="#6FCF97" strokeWidth="5" strokeLinecap="round" />
                <line x1="56" y1="80" x2="62" y2="95" stroke="#6FCF97" strokeWidth="5" strokeLinecap="round" />
                {/* Person 2 */}
                <circle cx="110" cy="55" r="12" fill="#4A90E2" />
                <rect x="104" y="67" width="12" height="28" rx="6" fill="#4A90E2" />
                <line x1="104" y1="80" x2="98" y2="95" stroke="#4A90E2" strokeWidth="5" strokeLinecap="round" />
                <line x1="116" y1="80" x2="122" y2="95" stroke="#4A90E2" strokeWidth="5" strokeLinecap="round" />
                {/* Ball */}
                <circle cx="80" cy="100" r="10" fill="#F4B740" />
                <path d="M72 100 Q80 92 88 100 Q80 108 72 100" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: 25,
                color: 'var(--cl-text-main)',
                textAlign: 'center',
                margin: '0 0 8px',
                lineHeight: 1.3,
              }}
            >
              Find the right coach{' '}
              <span style={{ display: 'block' }}>Train better.</span>
              {/* <span style={{ color: 'var(--cl-primary)', display: 'block' }}>
                Achieve more.
              </span> */}
            </h1>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                color: 'var(--cl-text-light)',
                textAlign: 'center',
                margin: '0 0 8px',
                lineHeight: 1.6,
              }}
            >
              A platform that connects athletes and parents with verified sports coaches nearby.
            </p>
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AppButton
              onClick={() => history.push('/auth/signup')}
              variant="primary"
            >
              Get Started
            </AppButton>
            <AppButton
              onClick={() => history.push('/auth/signin')}
              variant="outline"
            >
              I already have an account
            </AppButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
