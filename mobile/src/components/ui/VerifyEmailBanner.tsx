import React, { useState } from 'react';

import { useEmailVerified } from '@/hooks/useEmailVerified';
import { getErrorMessage } from '@/lib/apiError';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

/**
 * A prompt, not a gate. Nothing here blocks the app — verification is enforced
 * server-side at the two points it costs something: a coach being approved,
 * and an athlete paying. This just makes it easy to get it out of the way
 * first, and disappears on its own once the link is opened.
 */
const VerifyEmailBanner: React.FC = () => {
  const { verified } = useEmailVerified();
  const email = useAuthStore((s) => s.user?.email);
  const showToast = useUiStore((s) => s.showToast);
  const [sending, setSending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (verified || dismissed) return null;

  const resend = async () => {
    setSending(true);
    try {
      await authService.sendVerificationEmail();
      showToast(`Verification link sent to ${email ?? 'your email'}.`, 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not send that email.'), 'danger');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 11,
      background: 'var(--cl-pending-bg)', borderRadius: 14,
      padding: '12px 13px', margin: '0 0 14px',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: 'var(--cl-pending-text)',
        color: 'var(--cl-pending-bg)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1,
      }}>!</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cl-ink)' }}>Confirm your email</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)', marginTop: 2 }}>
          You&apos;ll need it before you can pay for a session or be listed as a coach.
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
          <span
            onClick={() => void resend()}
            style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cl-ink)', cursor: 'pointer' }}
          >
            {sending ? 'Sending…' : 'Resend link'}
          </span>
          <span
            onClick={() => setDismissed(true)}
            style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-muted-1)', cursor: 'pointer' }}
          >
            Not now
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailBanner;
