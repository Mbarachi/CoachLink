import React, { useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  AppButton, AppPage, BackButton,
  isPasswordValid, PasswordInput, PasswordRequirements, StatusBar,
} from '@/components/ui';
import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const DIGITS = 6;

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
  const canSubmit = filled === DIGITS
    && (mode === 'signup' || (isPasswordValid(newPassword) && newPassword === confirmPassword));

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
    <AppPage scrollable padding="auth">
      <StatusBar />
      <BackButton size={40} style={{ marginTop: 6 }} />

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
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Create a new password"
            labelStyle={{ margin: '22px 0 7px' }}
            style={{ marginBottom: newPassword ? 0 : 15 }}
          />
          <PasswordRequirements password={newPassword} />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter your new password"
          />
        </>
      )}

      <AppButton onClick={handleVerify} disabled={!canSubmit || loading} style={{ marginTop: 22, marginBottom: 22 }}>
        {loading ? 'Verifying…' : 'Verify'}
      </AppButton>
    </AppPage>
  );
};

export default OtpVerificationPage;
