import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { searchOutline, calendarOutline, notificationsOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const HomePage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);

  const firstName = user?.firstName ?? 'there';
  const role = user?.role === 'PARENT' ? 'Parent' : 'Athlete';

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div style={{ padding: '56px 24px 100px' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  color: 'var(--cl-text-light)',
                  margin: 0,
                }}
              >
                Lagos, Nigeria
              </p>
              <h2
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  color: 'var(--cl-text-main)',
                  margin: '2px 0 0',
                }}
              >
                Hello, {firstName}! 👋
              </h2>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  color: 'var(--cl-text-light)',
                  margin: '2px 0 0',
                }}
              >
                Welcome back
              </p>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#e8f8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IonIcon icon={notificationsOutline} style={{ fontSize: 22, color: 'var(--cl-primary)' }} />
            </div>
          </div>

          {/* Info cards */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
            <div
              style={{
                flex: 1,
                background: 'var(--cl-surface)',
                borderRadius: 16,
                padding: '16px',
                border: '1px solid var(--cl-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#e8f8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Person / human */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cl-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M4 21 C4 17 7.6 14 12 14 C16.4 14 20 17 20 21" />
                  </svg>
                </div>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: 'var(--cl-text-light)', margin: 0 }}>
                  Your Role
                </p>
              </div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: 'var(--cl-text-main)', margin: 0 }}>
                {role}
              </p>
            </div>

            <div
              style={{
                flex: 1,
                background: 'var(--cl-surface)',
                borderRadius: 16,
                padding: '16px',
                border: '1px solid var(--cl-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#e8f8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Swimming – swimmer with waves */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cl-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="17" cy="3.5" r="1.8" />
                    <path d="M2 11 C5 9 8 13 11 11 L17 7" />
                    <path d="M14 10 L16 15" />
                    <path d="M2 16 Q5.5 14 9 16 Q12.5 18 16 16 Q19 14 22 16" />
                    <path d="M2 19.5 Q5.5 17.5 9 19.5 Q12.5 21.5 16 19.5 Q19 17.5 22 19.5" />
                  </svg>
                </div>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: 'var(--cl-text-light)', margin: 0 }}>
                  Preferred Sport
                </p>
              </div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: 'var(--cl-text-main)', margin: 0 }}>
                Swimming
              </p>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div
            style={{
              background: 'var(--cl-surface)',
              borderRadius: 16,
              padding: '16px',
              border: '1px solid var(--cl-border)',
              marginBottom: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <IonIcon icon={calendarOutline} style={{ fontSize: 20, color: 'var(--cl-text-light)' }} />
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, color: 'var(--cl-text-light)', margin: 0 }}>
                Upcoming Bookings
              </p>
            </div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 28, color: 'var(--cl-text-main)', margin: 0 }}>
              0
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, color: 'var(--cl-text-light)', margin: '4px 0 0' }}>
              You have no upcoming bookings yet.
            </p>
          </div>

          {/* Quick Actions */}
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              color: 'var(--cl-text-main)',
              margin: '0 0 14px',
            }}
          >
            Quick Actions
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <AppCard
              onClick={() => history.push('/athlete/search')}
              style={{ flex: 1, textAlign: 'center', padding: '20px 12px' }}
            >
              <IonIcon icon={searchOutline} style={{ fontSize: 28, color: 'var(--cl-primary)' }} />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--cl-text-main)',
                  margin: '8px 0 0',
                }}
              >
                Find Coaches
              </p>
            </AppCard>
            <AppCard
              onClick={() => history.push('/athlete/bookings')}
              style={{ flex: 1, textAlign: 'center', padding: '20px 12px' }}
            >
              <IonIcon icon={calendarOutline} style={{ fontSize: 28, color: 'var(--cl-primary)' }} />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--cl-text-main)',
                  margin: '8px 0 0',
                }}
              >
                My Bookings
              </p>
            </AppCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
