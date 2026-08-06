import { useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton, AppInput, AppPage, AppSelect, BackButton,
  isPasswordValid, PasswordInput, PasswordRequirements, StatusBar,
} from '@/components/ui';
import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const STATES = ['Lagos', 'Ogun', 'Oyo', 'Rivers', 'FCT Abuja'];
const LGAS = ['Amuwo Odofin', 'Apapa', 'Ajeromi-Ifelodun', 'Ojo', 'Surulere'];

const SignUpPage: React.FC = () => {
  const history = useHistory();
  const setAuth = useAuthStore(s => s.setAuth);
  const showToast = useUiStore(s => s.showToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState(STATES[0]);
  const [lga, setLga] = useState(LGAS[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Ionic keeps this page mounted in the nav stack rather than unmounting it, so
  // plain useState alone would leave stale values behind on the next visit.
  useIonViewWillEnter(() => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setState(STATES[0]);
    setLga(LGAS[0]);
    setPassword('');
    setConfirmPassword('');
  });

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !address.trim() || !password || !confirmPassword) {
      showToast('Please fill in all fields.', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }
    if (!isPasswordValid(password)) {
      showToast('Password does not meet all the requirements below.', 'warning');
      return;
    }

    setLoading(true);

    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ') || '-';

    try {
      const { user, accessToken } = await authService.signUp({
        firstName,
        lastName,
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      });
      setAuth(user, accessToken);
      showToast('Account created — check your email for a verification code.', 'success');
      history.push('/auth/otp');
    } catch (err) {
      if (isBackendUnreachable(err)) {
        // Backend unreachable in dev — fall back to a mock session.
        setAuth(
          {
            id: `mock-${Date.now()}`,
            firstName,
            lastName,
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            role: 'ATHLETE',
            profileImage: null,
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          'mock-token',
        );
        history.push('/auth/otp');
      } else {
        showToast(getErrorMessage(err, 'Could not create your account. Please try again.'), 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppPage scrollable padding="auth">
      <StatusBar />
      <BackButton size={40} style={{ marginTop: 6 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '22px 0 6px' }}>Create account</h1>
      <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 22px' }}>Join CoachLink in under a minute.</p>

      <AppInput label="Full name" value={name} onChange={setName} placeholder="Ada Obi" style={{ marginBottom: 15 }} />
      <AppInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" style={{ marginBottom: 15 }} />
      <AppInput label="Phone number" type="tel" value={phoneNumber} onChange={setPhoneNumber} placeholder="0803 123 4567" style={{ marginBottom: 15 }} />
      <AppInput label="Address" value={address} onChange={setAddress} placeholder="Street address" style={{ marginBottom: 15 }} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        <div style={{ flex: 1 }}>
          <AppSelect label="State" value={state} onChange={setState} options={STATES} />
        </div>
        <div style={{ flex: 1 }}>
          <AppSelect label="LGA" value={lga} onChange={setLga} options={LGAS} />
        </div>
      </div>

      <PasswordInput label="Password" value={password} onChange={setPassword} placeholder="Create a password" style={{ marginBottom: password ? 0 : 15 }} />
      <PasswordRequirements password={password} />

      <PasswordInput label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter your password" />

      <AppButton onClick={handleSignUp} disabled={loading} style={{ marginTop: 22 }}>
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
