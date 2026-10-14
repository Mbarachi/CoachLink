import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useEmailVerified } from '@/hooks/useEmailVerified';
import { useAuthStore } from '@/store/auth.store';

interface VerifyEmailBannerProps {
  /**
   * Where confirming is the next thing they must do, like the last step of
   * coach sign-up: no "Not now", since there is nothing to put off.
   */
  required?: boolean;
}

/**
 * A prompt, not a gate. Nothing here blocks the app — verification is enforced
 * server-side at the two points it costs something: a coach being approved,
 * and an athlete paying. This just makes it easy to get it out of the way
 * first, and disappears on its own once the code is accepted.
 */
const VerifyEmailBanner: React.FC<VerifyEmailBannerProps> = ({ required = false }) => {
  const history = useHistory();
  const { verified } = useEmailVerified();
  const email = useAuthStore((s) => s.user?.email);
  const [dismissed, setDismissed] = useState(false);

  if (verified || dismissed) return null;

  // A fresh code is sent on arrival, and confirming brings them back here.
  const enterCode = () => history.push('/auth/otp', { send: true, back: true });

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
          {required
            ? `Confirm ${email ?? 'your email'} to submit your profile. We'll email you a 6-digit code.`
            : 'You\u2019ll need it before you can pay for a session or be listed as a coach.'}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
          <span
            onClick={enterCode}
            style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cl-ink)', cursor: 'pointer' }}
          >
            Enter code
          </span>
          {required ? null : (
            <span
              onClick={() => setDismissed(true)}
              style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-muted-1)', cursor: 'pointer' }}
            >
              Not now
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailBanner;
