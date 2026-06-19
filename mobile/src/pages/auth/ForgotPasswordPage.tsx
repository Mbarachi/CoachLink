import { IonContent, IonPage } from '@ionic/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { mailOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { z } from 'zod';

import { AppButton, AppInput, AppPageHeader } from '@/components/ui';

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

const ForgotPasswordPage: React.FC = () => {
  const history = useHistory();
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (_data: ForgotForm) => {
    setSent(true);
  };

  return (
    <IonPage>
      <AppPageHeader backHref="/auth/signin" />
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 24px 40px',
          }}
        >
          {/* Envelope illustration */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: '#e8f8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '32px 0 24px',
            }}
          >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <rect x="4" y="12" width="44" height="30" rx="4" fill="#6FCF97" opacity="0.2" stroke="#6FCF97" strokeWidth="2" />
              <path d="M4 16 L26 30 L48 16" stroke="#6FCF97" strokeWidth="2" fill="none" />
              <circle cx="38" cy="14" r="8" fill="#4A90E2" />
              <path d="M34 14 L37 17 L42 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--cl-text-main)',
              margin: '0 0 8px',
              textAlign: 'center',
            }}
          >
            Forgot Password?
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              color: 'var(--cl-text-light)',
              textAlign: 'center',
              margin: '0 0 32px',
              lineHeight: 1.6,
            }}
          >
            No worries! Enter your email address and we'll send you reset instructions.
          </p>

          {sent ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                width: '100%',
              }}
            >
              <IonIcon
                icon={checkmarkCircleOutline}
                style={{ fontSize: 56, color: 'var(--cl-success)' }}
              />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 15,
                  color: 'var(--cl-text-main)',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Reset link sent!
              </p>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  color: 'var(--cl-text-light)',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Check your inbox and follow the instructions.
              </p>
              <div style={{ width: '100%', marginTop: 16 }}>
                <AppButton onClick={() => history.push('/auth/signin')} variant="outline">
                  Back to Sign In
                </AppButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%' }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <AppInput
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    icon={mailOutline}
                    value={field.value}
                    onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                    onIonBlur={field.onBlur}
                    error={errors.email?.message}
                    autocomplete="email"
                  />
                )}
              />

              <div style={{ marginTop: 8 }}>
                <AppButton type="submit" loading={isSubmitting}>
                  Send Reset Link
                </AppButton>
              </div>

              <div style={{ marginTop: 16 }}>
                <AppButton variant="outline" onClick={() => history.push('/auth/signin')}>
                  Back to Sign In
                </AppButton>
              </div>
            </form>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPasswordPage;
