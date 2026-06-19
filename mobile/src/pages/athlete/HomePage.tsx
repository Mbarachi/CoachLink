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
                  <IonIcon icon="person-outline" style={{ fontSize: 18, color: 'var(--cl-primary)' }} />
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6FCF97" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
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
