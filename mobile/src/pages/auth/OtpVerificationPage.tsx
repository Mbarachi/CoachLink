import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';

import { ControlledPasswordInput } from '@/components/form';
import { AppButton, AppPage, BackButton, PasswordRequirements, StatusBar } from '@/components/ui';
import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';
import type { ResetPasswordValues } from '@/lib/schemas/auth';
import { resetPasswordSchema } from '@/lib/schemas/auth';
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
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const newPassword = watch('newPassword');

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
  const codeComplete = filled === DIGITS;

  const requireEmail = () => {
    if (!email) {
      showToast('Missing email — please restart this flow.', 'danger');
      return false;
    }
    return true;
  };

  const verifySignup = async () => {
    if (!codeComplete || !requireEmail()) return;
    setLoading(true);
    try {
      await authService.verifyOtp({ email: email!, otp: code });
      updateUser({ isVerified: true });
      showToast('Email verified.', 'success');
      history.push('/auth/role');
    } catch (err) {
      showToast(
        isBackendUnreachable(err)
          ? "Can't reach the server. Check that the backend is running."
          : getErrorMessage(err, 'Invalid or expired code.'),
        'danger',
      );
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (values: ResetPasswordValues) => {
    if (!codeComplete) {
      showToast('Enter the 6-digit code from your email.', 'warning');
      return;
    }
    if (!requireEmail()) return;

    setLoading(true);
    try {
      await authService.resetPassword({ email: email!, otp: code, newPassword: values.newPassword });
      showToast('Password reset successfully.', 'success');
      history.push('/auth/reset-success');
    } catch (err) {
      // Never fake success here — claiming the password changed when it didn't
      // would leave the user locked out with a password they think is set.
      showToast(
        isBackendUnreachable(err)
          ? "Can't reach the server. Check that the backend is running."
          : getErrorMessage(err, 'Invalid or expired code.'),
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
          <ControlledPasswordInput
            control={control}
            name="newPassword"
            label="New password"
            placeholder="Create a new password"
            hideError
            labelStyle={{ margin: '22px 0 7px' }}
            style={{ marginBottom: newPassword ? 0 : 15 }}
          />
          <PasswordRequirements password={newPassword} />
          <ControlledPasswordInput
            control={control}
            name="confirmPassword"
            label="Confirm new password"
            placeholder="Re-enter your new password"
          />
        </>
      )}

      <AppButton
        onClick={mode === 'reset' ? handleSubmit(submitReset, onInvalid) : verifySignup}
        disabled={!codeComplete || loading}
        style={{ marginTop: 22, marginBottom: 22 }}
      >
        {loading ? 'Verifying…' : 'Verify'}
      </AppButton>
    </AppPage>
  );
};

export default OtpVerificationPage;
