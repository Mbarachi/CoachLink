import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppInput, AppPage, BackButton, PasswordInput, StatusBar } from '@/components/ui';
import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const SignInPage: React.FC = () => {
  const history = useHistory();
  const setAuth = useAuthStore((s) => s.setAuth);
  const showToast = useUiStore((s) => s.showToast);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const mockSignIn = (role: 'ATHLETE' | 'COACH') => {
    setAuth({
      id: 'dev-user',
      firstName: email.split('@')[0] || 'Ada',
      lastName: 'Obi',
      email: email || 'ada@example.com',
      phoneNumber: '',
      role,
      profileImage: null,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, 'dev-token');
    history.replace(role === 'COACH' ? '/coach/dashboard' : '/athlete/home');
  };

  const handleSignIn = async () => {
    if (!email || !password) { showToast('Please enter your email and password.', 'warning'); return; }
    setLoading(true);
    try {
      const { user, accessToken } = await authService.signIn({ email, password });
      setAuth(user, accessToken);
      history.replace(user.role === 'COACH' ? '/coach/dashboard' : '/athlete/home');
    } catch (err) {
      if (isBackendUnreachable(err)) {
        // Backend unreachable in dev — fall back to mock session
        // mockSignIn('ATHLETE');
      } else {
        showToast(getErrorMessage(err, 'Invalid email or password.'), 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppPage padding="auth">
      <StatusBar />
      <BackButton size={40} style={{ marginTop: 6 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>Welcome back</h1>
      <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 26px' }}>Sign in to keep training.</p>

      <AppInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" style={{ marginBottom: 16 }} />
      <PasswordInput label="Password" value={password} onChange={setPassword} placeholder="Your password" />

      <AppButton variant="text" fullWidth={false} onClick={() => history.push('/auth/forgot-password')} style={{ alignSelf: 'flex-end', marginTop: 11, fontSize: 13 }}>
        Forgot password?
      </AppButton>

      <AppButton onClick={handleSignIn} disabled={loading} style={{ marginTop: 20 }}>
        {loading ? 'Signing in…' : 'Sign in'}
      </AppButton>

      <div style={{ flex: 1 }} />

      <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--cl-muted-1)', marginBottom: 24 }}>
        New here?{' '}
        <span onClick={() => history.push('/auth/signup')} style={{ color: 'var(--cl-ink)', fontWeight: 700, cursor: 'pointer' }}>Create an account</span>
      </p>
    </AppPage>
  );
};

export default SignInPage;
