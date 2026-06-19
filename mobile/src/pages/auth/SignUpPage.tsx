import { IonContent, IonPage } from '@ionic/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  mailOutline,
  personOutline,
  callOutline,
  lockClosedOutline,
} from 'ionicons/icons';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { z } from 'zod';

import { AppButton, AppInput, AppPageHeader } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const signUpSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    phoneNumber: z.string().min(7, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUpPage: React.FC = () => {
  const history = useHistory();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignUpForm) => {
    // Mock: store temp user without role yet
    setAuth(
      {
        id: `mock-${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: 'ATHLETE', // will be overwritten on role selection
        profileImage: null,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      'mock-token',
    );
    history.push('/auth/role');
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
            Create your account
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              color: 'var(--cl-text-light)',
              margin: '0 0 28px',
            }}
          >
            Join CoachLink to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name row */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      placeholder="First Name"
                      icon={personOutline}
                      value={field.value}
                      onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      onIonBlur={field.onBlur}
                      error={errors.firstName?.message}
                    />
                  )}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      placeholder="Last Name"
                      icon={personOutline}
                      value={field.value}
                      onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      onIonBlur={field.onBlur}
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </div>
            </div>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <AppInput
                  placeholder="Email"
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

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <AppInput
                  placeholder="Phone Number"
                  type="tel"
                  icon={callOutline}
                  value={field.value}
                  onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                  onIonBlur={field.onBlur}
                  error={errors.phoneNumber?.message}
                  autocomplete="tel"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <AppInput
                  placeholder="Password"
                  type="password"
                  icon={lockClosedOutline}
                  value={field.value}
                  onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                  onIonBlur={field.onBlur}
                  error={errors.password?.message}
                  autocomplete="new-password"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <AppInput
                  placeholder="Confirm Password"
                  type="password"
                  icon={lockClosedOutline}
                  value={field.value}
                  onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                  onIonBlur={field.onBlur}
                  error={errors.confirmPassword?.message}
                  autocomplete="new-password"
                />
              )}
            />

            {/* Terms */}
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 12,
                color: 'var(--cl-text-light)',
                textAlign: 'center',
                margin: '4px 0 20px',
              }}
            >
              I agree to the{' '}
              <span style={{ color: 'var(--cl-accent)', cursor: 'pointer' }}>
                Terms of Service
              </span>{' '}
              and{' '}
              <span style={{ color: 'var(--cl-accent)', cursor: 'pointer' }}>
                Privacy Policy
              </span>
            </p>

            <AppButton type="submit" loading={isSubmitting}>
              Sign Up
            </AppButton>
          </form>

          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 14,
              color: 'var(--cl-text-light)',
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            Already have an account?{' '}
            <span
              onClick={() => history.push('/auth/signin')}
              style={{ color: 'var(--cl-accent)', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign In
            </span>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUpPage;
