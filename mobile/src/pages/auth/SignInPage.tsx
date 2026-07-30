import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const S = {
  label: { fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', marginBottom: 7, display: 'block' } as React.CSSProperties,
  input: {
    width: '100%', height: 52, borderRadius: 'var(--cl-radius-input)',
    border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
    padding: '0 15px', fontFamily: 'var(--cl-font-body)', fontSize: 14.5,
    color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
  } as React.CSSProperties,
};

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
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 var(--cl-px-auth)', fontFamily: 'var(--cl-font-body)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
            <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
          </div>

          <button onClick={() => history.goBack()} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 18, cursor: 'pointer', marginTop: 6, flexShrink: 0 }}>‹</button>

          <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>Welcome back</h1>
          <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 26px' }}>Sign in to keep training.</p>

          <label style={S.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ ...S.input, marginBottom: 16 }} />

          <label style={S.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" style={S.input} />

          <button onClick={() => history.push('/auth/forgot-password')} style={{ alignSelf: 'flex-end', marginTop: 11, border: 'none', background: 'none', color: 'var(--cl-ink)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--cl-font-body)' }}>Forgot password?</button>

          <button onClick={handleSignIn} disabled={loading} style={{
            marginTop: 20, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)',
            background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
            fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
            opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Signing in…' : 'Sign in'}</button>

          <div style={{ flex: 1 }} />

          {/* Dev shortcuts — skip API when backend is not running */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => mockSignIn('ATHLETE')} style={{ flex: 1, height: 40, borderRadius: 12, border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', color: 'var(--cl-muted-3)', fontFamily: 'var(--cl-font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              → Athlete view
            </button>
            <button onClick={() => mockSignIn('COACH')} style={{ flex: 1, height: 40, borderRadius: 12, border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', color: 'var(--cl-muted-3)', fontFamily: 'var(--cl-font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              → Coach view
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--cl-muted-1)', marginBottom: 24 }}>
            New here?{' '}
            <span onClick={() => history.push('/auth/signup')} style={{ color: 'var(--cl-ink)', fontWeight: 700, cursor: 'pointer' }}>Create an account</span>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignInPage;
