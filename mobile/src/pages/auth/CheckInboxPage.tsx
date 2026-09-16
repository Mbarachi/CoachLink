import { App } from '@capacitor/app';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { AppButton, AppPage, BackButton, EmptyIllustration } from '@/components/ui';
import { getErrorMessage } from '@/lib/apiError';
// Imported directly rather than through the backend switch: this screen only
// exists for Firebase, which verifies by emailed link instead of a code.
import { authService as firebaseAuth } from '@/services/firebase/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const RESEND_SECONDS = 45;

interface CheckInboxPageProps {
  mode: 'verify' | 'reset';
}

const COPY = {
  verify: {
    title: 'Check your inbox',
    body: 'We sent a verification link to',
    hint: "Open it and come straight back — we'll notice automatically.",
    cta: "I've verified — continue",
  },
  reset: {
    title: 'Check your inbox',
    body: 'We sent a password reset link to',
    hint: 'Open it to choose a new password, then sign in.',
    cta: 'Back to sign in',
  },
} as const;

const CheckInboxPage: React.FC<CheckInboxPageProps> = ({ mode }) => {
  const history = useHistory();
  const location = useLocation<{ email?: string } | undefined>();
  const showToast = useUiStore((s) => s.showToast);
  const updateUser = useAuthStore((s) => s.updateUser);
  const storedEmail = useAuthStore((s) => s.user?.email);

  const email = location.state?.email ?? storedEmail ?? 'your email';
  const copy = COPY[mode];

  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = useRef(false);

  /** Advances the moment Firebase reports the address confirmed. */
  const advanceIfVerified = useCallback(async () => {
    if (mode !== 'verify' || done.current) return false;
    try {
      if (!(await firebaseAuth.refreshVerification())) return false;
    } catch {
      return false;   // offline or signed out — the button still works
    }
    done.current = true;
    updateUser({ isVerified: true });
    showToast('Email verified.', 'success');
    history.push('/auth/role');
    return true;
  }, [mode, updateUser, showToast, history]);

  /**
   * Verifying means leaving for a mail app, so the return trip is the moment
   * to check — and polling covers the case where the link is opened on another
   * device entirely. Between them the user never has to press anything; the
   * button below is the fallback, not the mechanism.
   */
  useEffect(() => {
    if (mode !== 'verify') return;

    const poll = setInterval(() => void advanceIfVerified(), 5000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void advanceIfVerified();
    };
    document.addEventListener('visibilitychange', onVisible);

    const nativeResume = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) void advanceIfVerified();
    });

    return () => {
      clearInterval(poll);
      document.removeEventListener('visibilitychange', onVisible);
      void nativeResume.then((l) => l.remove());
    };
  }, [mode, advanceIfVerified]);

  // A real countdown, unlike the static "Resend in 0:42" the OTP screen shows.
  useEffect(() => {
    timer.current = setInterval(() => setCooldown((n) => (n > 0 ? n - 1 : 0)), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const resend = async () => {
    try {
      if (mode === 'verify') {
        await firebaseAuth.sendVerificationEmail();
      } else {
        await firebaseAuth.forgotPassword({ email });
      }
      setCooldown(RESEND_SECONDS);
      showToast('Sent — check your inbox.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not resend that email.'), 'danger');
    }
  };

  const primary = async () => {
    if (mode === 'reset') {
      history.replace('/auth/signin');
      return;
    }

    setChecking(true);
    try {
      if (!(await advanceIfVerified())) {
        showToast('Not verified yet — open the link in your email first.', 'warning');
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not check your verification status.'), 'danger');
    } finally {
      setChecking(false);
    }
  };

  return (
    <AppPage scrollable padding="auth">
      <BackButton size={40} style={{ marginTop: 6 }} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 26 }}>
        <EmptyIllustration name="requests" size={132} />
      </div>

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '18px 0 8px', textAlign: 'center' }}>
        {copy.title}
      </h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: '0 0 4px', textAlign: 'center' }}>
        {copy.body}
      </p>
      <p style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--cl-ink)', margin: '0 0 10px', textAlign: 'center', wordBreak: 'break-all' }}>
        {email}
      </p>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: '0 0 26px', textAlign: 'center' }}>
        {copy.hint}
      </p>

      <AppButton onClick={() => void primary()} loading={checking} loadingLabel="Checking…">
        {copy.cta}
      </AppButton>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--cl-muted-1)' }}>
        {cooldown > 0 ? (
          <>Didn&apos;t get it? Resend in 0:{String(cooldown).padStart(2, '0')}</>
        ) : (
          <>
            Didn&apos;t get it?{' '}
            <span onClick={() => void resend()} style={{ color: 'var(--cl-ink)', fontWeight: 700, cursor: 'pointer' }}>
              Resend email
            </span>
          </>
        )}
      </div>

      {mode === 'verify' && (
        <AppButton variant="text" onClick={() => history.replace('/auth/role')} style={{ marginTop: 14 }}>
          Skip for now
        </AppButton>
      )}
    </AppPage>
  );
};

export default CheckInboxPage;
