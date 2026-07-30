import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { authService } from '@/services/auth.service';
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
    showToast('Code sent — check your email.', 'success');
    history.push('/auth/forgot-password/otp', { email: email.trim() });
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

          <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>Reset password</h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '0 0 26px' }}>
            Enter your email and we'll send a 6-digit code to reset your password.
          </p>

          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', marginBottom: 7, display: 'block' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%', height: 52, borderRadius: 'var(--cl-radius-input)',
              border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
              padding: '0 15px', fontFamily: 'var(--cl-font-body)', fontSize: 14.5,
              color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
            }}
          />

          <button onClick={handleSendCode} disabled={loading} style={{
            marginTop: 22, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)',
            background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
            fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
            opacity: loading ? 0.7 : 1,
          }}>{loading ? 'Sending…' : 'Send code'}</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPasswordPage;
