import { useIonViewWillEnter } from '@ionic/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { ControlledInput, ControlledPasswordInput, ControlledSelect } from '@/components/form';
import { AppButton, AppPage, BackButton, PasswordRequirements, StatusBar } from '@/components/ui';
import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import type { SignUpValues } from '@/lib/schemas/auth';
import { signUpSchema } from '@/lib/schemas/auth';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const STATES = ['Lagos', 'Ogun', 'Oyo', 'Rivers', 'FCT Abuja'];
const LGAS = ['Amuwo Odofin', 'Apapa', 'Ajeromi-Ifelodun', 'Ojo', 'Surulere'];

const DEFAULTS: SignUpValues = {
  name: '', email: '', phoneNumber: '', address: '',
  state: STATES[0], lga: LGAS[0], password: '', confirmPassword: '',
};

const SignUpPage: React.FC = () => {
  const history = useHistory();
  const setAuth = useAuthStore(s => s.setAuth);
  const showToast = useUiStore(s => s.showToast);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: DEFAULTS,
    mode: 'onTouched',
  });

  const password = watch('password');

  // Ionic keeps this page mounted in the nav stack rather than unmounting it, so
  // the form would otherwise still hold the previous signup's values.
  useIonViewWillEnter(() => reset(DEFAULTS));

  const onSubmit = async (values: SignUpValues) => {
    setLoading(true);

    const [firstName, ...rest] = values.name.trim().split(' ');
    const lastName = rest.join(' ') || '-';

    try {
      const { user, accessToken } = await authService.signUp({
        firstName,
        lastName,
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        address: values.address.trim(),
        state: values.state,
        lga: values.lga,
      });
      setAuth(user, accessToken);
      showToast('Account created — check your email for a verification code.', 'success');
      history.push('/auth/otp');
    } catch (err) {
      showToast(
        isBackendUnreachable(err)
          ? "Can't reach the server. Check that the backend is running."
          : getErrorMessage(err, 'Could not create your account. Please try again.'),
        'danger',
      );
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => showToast('Please fix the highlighted fields.', 'warning');

  return (
    <AppPage scrollable padding="auth">
      <StatusBar />
      <BackButton size={40} style={{ marginTop: 6 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '22px 0 6px' }}>Create account</h1>
      <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 22px' }}>Join CoachLink in under a minute.</p>

      <ControlledInput control={control} name="name" label="Full name" placeholder="Ada Obi" style={{ marginBottom: 15 }} />
      <ControlledInput control={control} name="email" label="Email" type="email" placeholder="you@example.com" style={{ marginBottom: 15 }} />
      <ControlledInput control={control} name="phoneNumber" label="Phone number" type="tel" placeholder="0803 123 4567" style={{ marginBottom: 15 }} />
      <ControlledInput control={control} name="address" label="Address" placeholder="Street address" style={{ marginBottom: 15 }} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        <div style={{ flex: 1 }}>
          <ControlledSelect control={control} name="state" label="State" options={STATES} />
        </div>
        <div style={{ flex: 1 }}>
          <ControlledSelect control={control} name="lga" label="LGA" options={LGAS} />
        </div>
      </div>

      {/* The checklist below already names what's outstanding, so the field
          suppresses its own duplicate error message. */}
      <ControlledPasswordInput
        control={control}
        name="password"
        label="Password"
        placeholder="Create a password"
        hideError
        style={{ marginBottom: password ? 0 : 15 }}
      />
      <PasswordRequirements password={password} />

      <ControlledPasswordInput
        control={control}
        name="confirmPassword"
        label="Confirm password"
        placeholder="Re-enter your password"
      />

      <AppButton onClick={handleSubmit(onSubmit, onInvalid)} disabled={loading} style={{ marginTop: 22 }}>
        {loading ? 'Creating…' : 'Continue'}
      </AppButton>

      <div style={{ flex: 1, minHeight: 32 }} />
      <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--cl-muted-1)', marginBottom: 24 }}>
        Already have an account?{' '}
        <span onClick={() => history.push('/auth/signin')} style={{ color: 'var(--cl-ink)', fontWeight: 700, cursor: 'pointer' }}>Sign in</span>
      </p>
    </AppPage>
  );
};

export default SignUpPage;
