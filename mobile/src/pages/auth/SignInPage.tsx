import { IonContent, IonPage } from '@ionic/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { z } from 'zod';

import { AppButton, AppInput, AppPageHeader } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const signInSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
});

type SignInForm = z.infer<typeof signInSchema>;

const SignInPage: React.FC = () => {
  const history = useHistory();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { emailOrPhone: '', password: '' },
  });

  const onSubmit = (data: SignInForm) => {
    // Mock sign-in — redirect to home
    setAuth(
      {
        id: 'mock-signin-user',
        firstName: 'Victor',
        lastName: 'User',
        email: data.emailOrPhone,
        phoneNumber: '',
        role: 'ATHLETE',
        profileImage: null,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      'mock-token',
    );
    history.replace('/athlete/home');
  };

  return (
    <IonPage>
      <AppPageHeader backHref="/welcome" />
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
            Welcome back!
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              color: 'var(--cl-text-light)',
              margin: '0 0 28px',
            }}
          >
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="emailOrPhone"
              control={control}
              render={({ field }) => (
                <AppInput
                  label="Email or Phone Number"
                  placeholder="Enter email or phone number"
                  icon={mailOutline}
                  value={field.value}
                  onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                  onIonBlur={field.onBlur}
                  error={errors.emailOrPhone?.message}
                  autocomplete="username"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <AppInput
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  icon={lockClosedOutline}
                  value={field.value}
                  onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                  onIonBlur={field.onBlur}
                  error={errors.password?.message}
                  autocomplete="current-password"
                />
              )}
            />

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <span
                onClick={() => history.push('/auth/forgot-password')}
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 14,
                  color: 'var(--cl-accent)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Forgot Password?
              </span>
            </div>

            <AppButton type="submit" loading={isSubmitting}>
              Sign In
            </AppButton>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '20px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--cl-border)' }} />
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 13,
                color: 'var(--cl-text-light)',
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--cl-border)' }} />
          </div>

          <AppButton variant="outline" onClick={() => {}}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
                <path fill="#FBBC05" d="M11.68 28.18A13.13 13.13 0 0 1 11 24c0-1.45.25-2.86.68-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.34-5.7z" />
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7C13.42 14.62 18.27 10.75 24 10.75z" />
              </svg>
              Continue with Google
            </span>
          </AppButton>

          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              color: 'var(--cl-text-light)',
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            Don't have an account?{' '}
            <span
              onClick={() => history.push('/auth/signup')}
              style={{ color: 'var(--cl-accent)', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignInPage;
