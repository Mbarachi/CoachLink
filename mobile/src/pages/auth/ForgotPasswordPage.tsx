import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppInput, AppPage, BackButton } from '@/components/ui';
import { authService } from '@/services';
import { useUiStore } from '@/store/ui.store';

const ForgotPasswordPage: React.FC = () => {
  const history = useHistory();
  const showToast = useUiStore(s => s.showToast);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      showToast('Please enter your email.', 'warning');
      return;
    }
    setLoading(true);

    // The backend always reports success here regardless of whether the email is
    // registered (avoids leaking account existence), and is best-effort even if
    // unreachable — either way we move on to the OTP screen.
    try {
      await authService.forgotPassword({ email: email.trim() });
    } catch {
      // ignore — proceed to OTP screen either way
    } finally {
      setLoading(false);
    }
    showToast('Reset link sent — check your email.', 'success');
    history.push('/auth/forgot-password/otp', { email: email.trim() });
  };

  return (
    <AppPage padding="auth">
      <BackButton size={40} style={{ marginTop: 6 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>Reset password</h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '0 0 26px' }}>
Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <AppInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />

      <AppButton onClick={handleSendCode} loading={loading}
            loadingLabel="Sending…" style={{ marginTop: 22 }}>
        Send reset link
      </AppButton>
    </AppPage>
  );
};

export default ForgotPasswordPage;
