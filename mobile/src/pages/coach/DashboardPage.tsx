import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { calendarOutline, notificationsOutline, cashOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.firstName ?? 'Coach';

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div style={{ padding: '56px 24px 100px' }}>
          {/* Top bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
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
              <IonIcon
                icon={notificationsOutline}
                style={{ fontSize: 22, color: 'var(--cl-primary)' }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Pending Requests', value: '0', icon: calendarOutline },
              { label: 'This Month', value: '₦0', icon: cashOutline },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  background: 'var(--cl-surface)',
                  borderRadius: 16,
                  padding: 16,
                  border: '1px solid var(--cl-border)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#e8f8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                >
                  <IonIcon
                    icon={stat.icon}
                    style={{ fontSize: 18, color: 'var(--cl-primary)' }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: 22,
                    color: 'var(--cl-text-main)',
                    margin: '0 0 2px',
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 12,
                    color: 'var(--cl-text-light)',
                    margin: 0,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
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
              onClick={() => history.push('/coach/requests')}
              style={{ flex: 1, textAlign: 'center', padding: '20px 12px' }}
            >
              <IonIcon
                icon={calendarOutline}
                style={{ fontSize: 28, color: 'var(--cl-primary)' }}
              />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--cl-text-main)',
                  margin: '8px 0 0',
                }}
              >
                Requests
              </p>
            </AppCard>
            <AppCard
              onClick={() => history.push('/coach/earnings')}
              style={{ flex: 1, textAlign: 'center', padding: '20px 12px' }}
            >
              <IonIcon
                icon={cashOutline}
                style={{ fontSize: 28, color: 'var(--cl-primary)' }}
              />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--cl-text-main)',
                  margin: '8px 0 0',
                }}
              >
                Earnings
              </p>
            </AppCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
