import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { bicycleOutline, bodyOutline, footballOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppCard, AppPageHeader } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types';

interface RoleOption {
  role: UserRole;
  icon: string;
  title: string;
  subtitle: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'ATHLETE',
    icon: bicycleOutline,
    title: 'Athlete',
    subtitle: 'I want to find a coach to train with',
  },
  {
    role: 'PARENT',
    icon: bodyOutline,
    title: 'Parent',
    subtitle: 'I want to find a coach for my child',
  },
  {
    role: 'COACH',
    icon: footballOutline,
    title: 'Coach',
    subtitle: 'I want to join as a coach and train athletes',
  },
];

const RoleSelectionPage: React.FC = () => {
  const history = useHistory();
  const updateUser = useAuthStore((s) => s.updateUser);
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    updateUser({ role: selected });
    history.push('/auth/complete-profile');
  };

  return (
    <IonPage>
      <AppPageHeader showBack={false} />
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div style={{ padding: '8px 24px 40px' }}>
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 24,
              color: 'var(--cl-text-main)',
              margin: '0 0 4px',
            }}
          >
            Select your role
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              color: 'var(--cl-text-light)',
              margin: '0 0 28px',
            }}
          >
            Choose the option that best describes you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ROLES.map((option) => (
              <AppCard
                key={option.role}
                selected={selected === option.role}
                onClick={() => setSelected(option.role)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background:
                        selected === option.role
                          ? 'var(--cl-primary)'
                          : '#e8f8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                  >
                    <IonIcon
                      icon={option.icon}
                      style={{
                        fontSize: 26,
                        color: selected === option.role ? '#fff' : 'var(--cl-primary)',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: 16,
                        color: 'var(--cl-text-main)',
                        margin: '0 0 2px',
                      }}
                    >
                      {option.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: 13,
                        color: 'var(--cl-text-light)',
                        margin: 0,
                      }}
                    >
                      {option.subtitle}
                    </p>
                  </div>
                  {/* Chevron */}
                  <IonIcon
                    icon="chevron-forward"
                    style={{ fontSize: 18, color: 'var(--cl-text-light)' }}
                  />
                </div>
              </AppCard>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <AppButton disabled={!selected} onClick={handleContinue}>
              Continue
            </AppButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RoleSelectionPage;
