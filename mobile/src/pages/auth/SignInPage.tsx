import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppInput, AppPage, BackButton, PasswordInput } from '@/components/ui';
import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const SignInPage: React.FC = () => {
  const history = useHistory();
  const setAuth = useAuthStore((s) => s.setAuth);
  const showToast = useUiStore((s) => s.showToast);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) { showToast('Please enter your email and password.', 'warning'); return; }
    setLoading(true);
    try {
      const { user, accessToken } = await authService.signIn({ email, password });
      setAuth(user, accessToken);
      history.replace(user.role === 'COACH' ? '/coach/dashboard' : '/athlete/home');
    } catch (err) {
      if (isBackendUnreachable(err)) {
        showToast("Can't reach the server. Check that the backend is running.", 'danger');
      } else {
        showToast(getErrorMessage(err, 'Invalid email or password.'), 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppPage padding="auth">
      <BackButton size={40} style={{ marginTop: 6 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>Welcome back</h1>
      <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 26px' }}>Sign in to keep training.</p>

      <AppInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" style={{ marginBottom: 16 }} />
      <PasswordInput label="Password" value={password} onChange={setPassword} placeholder="Your password" />

      <AppButton variant="text" fullWidth={false} onClick={() => history.push('/auth/forgot-password')} style={{ alignSelf: 'flex-end', marginTop: 11, fontSize: 13 }}>
        Forgot password?
      </AppButton>

      <AppButton onClick={handleSignIn} loading={loading}
            loadingLabel="Signing in…" style={{ marginTop: 20 }}>
        Sign in
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
