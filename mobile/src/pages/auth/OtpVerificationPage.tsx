import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const DIGITS = 6;

const inputStyle: React.CSSProperties = {
  width: '100%', height: 52, borderRadius: 14,
  border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
  padding: '0 15px', fontFamily: 'var(--cl-font-body)', fontSize: 14.5,
  color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
};

const OtpVerificationPage: React.FC<{ mode?: 'signup' | 'reset' }> = ({ mode = 'signup' }) => {
  const history = useHistory();
  const location = useLocation<{ email?: string } | undefined>();
  const authUser = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);
  const showToast = useUiStore(s => s.showToast);
  const email = mode === 'reset' ? location.state?.email : authUser?.email;

  const [otp, setOtp] = useState<string[]>(Array(DIGITS).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < DIGITS - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const filled = otp.filter(Boolean).length;
  const code = otp.join('');
  const canSubmit = filled === DIGITS && (mode === 'signup' || (newPassword.length >= 6 && newPassword === confirmPassword));

  const handleVerify = async () => {
    if (!canSubmit) return;
    if (mode === 'reset' && newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }
    if (!email) {
      showToast('Missing email — please restart this flow.', 'danger');
      return;
    }

    setLoading(true);

    if (mode === 'signup') {
      try {
        await authService.verifyOtp({ email, otp: code });
        updateUser({ isVerified: true });
        showToast('Email verified.', 'success');
        history.push('/auth/role');
      } catch (err) {
        if (isBackendUnreachable(err)) {
          updateUser({ isVerified: true });
          history.push('/auth/role');
        } else {
          showToast(getErrorMessage(err, 'Invalid or expired code.'), 'danger');
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await authService.resetPassword({ email, otp: code, newPassword });
        showToast('Password reset successfully.', 'success');
        history.push('/auth/reset-success');
      } catch (err) {
        if (isBackendUnreachable(err)) {
          history.push('/auth/reset-success');
        } else {
          showToast(getErrorMessage(err, 'Invalid or expired code.'), 'danger');
        }
      } finally {
        setLoading(false);
      }
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

          <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>Verify it's you</h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '0 0 28px' }}>
            We sent a 6-digit code to your email. Enter it below.
          </p>

          {/* Grid prevents Ionic's input { width: 100% } reset from breaking flex layout */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DIGITS}, 1fr)`, gap: 10 }}>
            {Array(DIGITS).fill(0).map((_, i) => (
              <input
                key={i}
                ref={el => { refs.current[i] = el; }}
                value={otp[i]}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={1}
                inputMode="numeric"
                style={{
                  width: '100%',
                  height: 60,
                  borderRadius: 14,
                  border: otp[i] ? '1.6px solid var(--cl-ink)' : '1px solid var(--cl-border)',
                  background: 'var(--cl-surface)',
                  textAlign: 'center',
                  fontFamily: 'var(--cl-font-display)',
                  fontWeight: 700,
                  fontSize: 24,
                  color: 'var(--cl-ink)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            ))}
          </div>

          <p style={{ fontSize: 13.5, color: 'var(--cl-muted-1)', marginTop: 22 }}>
            Didn't get it?{' '}
            <span style={{ color: 'var(--cl-ink)', fontWeight: 700 }}>Resend in 0:42</span>
          </p>

          {mode === 'reset' && (
            <>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', margin: '22px 0 7px', display: 'block' }}>New password</label>
              <div style={{ position: 'relative', marginBottom: 15 }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Create a new password"
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <IonIcon
                  icon={showPassword ? eyeOutline : eyeOffOutline}
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 19, color: 'var(--cl-muted-2)', cursor: 'pointer' }}
                />
              </div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', marginBottom: 7, display: 'block' }}>Confirm new password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                style={inputStyle}
              />
            </>
          )}

          <button
            onClick={handleVerify}
            disabled={!canSubmit || loading}
            style={{
              marginTop: 22, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)',
              background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
              fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
              opacity: !canSubmit || loading ? 0.5 : 1,
            }}
          >{loading ? 'Verifying…' : 'Verify'}</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OtpVerificationPage;
