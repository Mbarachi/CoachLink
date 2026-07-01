import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { authService } from '@/services/auth.service';

const S = {
  label: { fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', marginBottom: 7, display: 'block' } as React.CSSProperties,
  input: {
    width: '100%', height: 52, borderRadius: 'var(--cl-radius-input)',
    border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
    padding: '0 15px', fontFamily: 'var(--cl-font-body)', fontSize: 14.5,
    color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
  } as React.CSSProperties,
};

const SignUpPage: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const [firstName, ...rest] = name.trim().split(' ');
      await authService.signUp({ firstName, lastName: rest.join(' ') || '-', email, password, phoneNumber: '' });
      history.push('/auth/otp');
    } catch {
      setError('Could not create account. Try a different email.');
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

          <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '22px 0 6px' }}>Create account</h1>
          <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 22px' }}>Join CoachLink in under a minute.</p>

          <label style={S.label}>Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ada Obi" style={{ ...S.input, marginBottom: 15 }} />

          <label style={S.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ ...S.input, marginBottom: 15 }} />

          <label style={S.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" style={S.input} />

          {error && <p style={{ fontSize: 12.5, color: 'var(--cl-destructive)', marginTop: 8 }}>{error}</p>}

          <button onClick={handleSignUp} disabled={loading} style={{
            marginTop: 22, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)',
            background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
            fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
            opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Creating…' : 'Continue'}</button>

          <div style={{ flex: 1 }} />
          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--cl-muted-1)', marginBottom: 24 }}>
            Already have an account?{' '}
            <span onClick={() => history.push('/auth/signin')} style={{ color: 'var(--cl-ink)', fontWeight: 700, cursor: 'pointer' }}>Sign in</span>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUpPage;
