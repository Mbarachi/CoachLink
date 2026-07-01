import { IonContent, IonPage } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

const DIGITS = 6;

const OtpVerificationPage: React.FC = () => {
  const history = useHistory();
  const [otp, setOtp] = useState<string[]>(Array(DIGITS).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

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

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
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
                  flex: 1, height: 60, borderRadius: 14,
                  border: otp[i] ? '1.6px solid var(--cl-ink)' : '1px solid var(--cl-border)',
                  background: 'var(--cl-surface)',
                  textAlign: 'center',
                  fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 24,
                  color: 'var(--cl-ink)', outline: 'none',
                }}
              />
            ))}
          </div>

          <p style={{ fontSize: 13.5, color: 'var(--cl-muted-1)', marginTop: 22 }}>
            Didn't get it?{' '}
            <span style={{ color: 'var(--cl-ink)', fontWeight: 700 }}>Resend in 0:42</span>
          </p>

          <button
            onClick={() => history.push('/auth/role')}
            disabled={filled < DIGITS}
            style={{
              marginTop: 22, border: 'none', height: 56, borderRadius: 'var(--cl-radius-btn)',
              background: 'var(--cl-accent)', color: 'var(--cl-on-accent)',
              fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%',
              opacity: filled < DIGITS ? 0.5 : 1,
            }}
          >Verify</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OtpVerificationPage;
