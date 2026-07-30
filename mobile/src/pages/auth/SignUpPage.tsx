import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
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
    padding: '0 15px', fontFamily: 'var(--cl-font-body)', fontSize: 16,
    color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
  } as React.CSSProperties,
};

const PasswordField: React.FC<{
  label: string; placeholder: string; value: string; onChange: (v: string) => void; marginBottom?: number;
}> = ({ label, placeholder, value, onChange, marginBottom }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <label style={S.label}>{label}</label>
      <div style={{ position: 'relative', marginBottom }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...S.input, paddingRight: 44 }}
        />
        <IonIcon
          icon={visible ? eyeOutline : eyeOffOutline}
          onClick={() => setVisible(v => !v)}
          style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 19, color: 'var(--cl-muted-2)', cursor: 'pointer',
          }}
        />
      </div>
    </>
  );
};

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

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !address.trim() || !password || !confirmPassword) {
      showToast('Please fill in all fields.', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
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
    <IonPage>
      <IonContent style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 var(--cl-px-auth)', fontFamily: 'var(--cl-font-body)', minHeight: '100%' }}>
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

          <label style={S.label}>Phone number</label>
          <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="0803 123 4567" style={{ ...S.input, marginBottom: 15 }} />

          <label style={S.label}>Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" style={{ ...S.input, marginBottom: 15 }} />

          <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>State</label>
              <select value={state} onChange={e => setState(e.target.value)} style={{ ...S.input, padding: '0 12px' }}>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>LGA</label>
              <select value={lga} onChange={e => setLga(e.target.value)} style={{ ...S.input, padding: '0 12px' }}>
                {LGAS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <PasswordField label="Password" placeholder="Create a password" value={password} onChange={setPassword} marginBottom={15} />

          <PasswordField label="Confirm password" placeholder="Re-enter your password" value={confirmPassword} onChange={setConfirmPassword} />

          <button onClick={handleSignUp} disabled={loading} style={{
            marginTop: 22, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)',
            background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
            fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
            opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Creating…' : 'Continue'}</button>

          <div style={{ flex: 1, minHeight: 32 }} />
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
