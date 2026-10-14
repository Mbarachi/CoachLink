import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { AppButton, AppPage, BackButton } from '@/components/ui';
import { EMAIL_VERIFIED_EVENT } from '@/hooks/useEmailVerified';
import { getErrorMessage } from '@/lib/apiError';
import { setBackOverride } from '@/lib/backNavigation';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const DIGITS = 6;
/** Matches the backend's minimum gap between sends. */
const RESEND_SECONDS = 45;

interface VerifyEmailState {
  /** Send a code on arrival. Sign-up has just sent one, so it leaves this off. */
  send?: boolean;
  /** Opened from a banner: finishing returns there instead of moving on. */
  back?: boolean;
  /** Where to go once confirmed, when not returning. Sign-up passes the role screen. */
  next?: string;
}

/**
 * Confirms an email address with the 6-digit code the backend emails through
 * Resend. Reached straight after sign-up, and from the "Confirm your email"
 * banners. Skippable, as the link flow was: confirmation is enforced where it
 * costs something (submitting a coach profile, paying), not as a wall here.
 */
const VerifyEmailPage: React.FC = () => {
  const history = useHistory();
  const state = useLocation<VerifyEmailState | undefined>().state ?? {};
  const email = useAuthStore((s) => s.user?.email) ?? 'your email';
  const showToast = useUiStore((s) => s.showToast);

  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const [sending, setSending] = useState(false);

  const leave = useCallback(() => {
    if (state.back) history.goBack();
    else history.replace(state.next ?? '/auth/role');
  }, [history, state.back, state.next]);

  // The phone's back button matches Skip: it should never strand them here.
  useEffect(() => {
    setBackOverride('/auth/otp', leave);
    return () => setBackOverride('/auth/otp', null);
  }, [leave]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = useCallback(async (announce: boolean) => {
    setSending(true);
    try {
      const res = await authService.sendEmailCode();
      if (res.alreadyVerified) {
        window.dispatchEvent(new Event(EMAIL_VERIFIED_EVENT));
        showToast('Your email is already confirmed.', 'success');
        leave();
        return;
      }
      setCooldown(RESEND_SECONDS);
      if (announce) showToast(`New code sent to ${email}.`, 'success');
    } catch (err) {
      // On arrival, "a code was just sent" means one is already in their inbox
      // (sign-up sent it moments ago): nothing to report, the timer runs on.
      const justSent = (err as { code?: string })?.code === 'functions/resource-exhausted';
      if (!announce && justSent) return;
      showToast(getErrorMessage(err, 'Could not send a code. Please try again.'), 'danger');
    } finally {
      setSending(false);
    }
  }, [email, leave, showToast]);

  // Arriving from a banner means no code may be waiting, or an expired one.
  useEffect(() => {
    if (state.send) void send(false);
    refs.current[0]?.focus();
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (code: string) => {
    setChecking(true);
    try {
      await authService.verifyEmailCode(code);
      window.dispatchEvent(new Event(EMAIL_VERIFIED_EVENT));
      showToast('Email confirmed.', 'success');
      leave();
    } catch (err) {
      showToast(getErrorMessage(err, 'That code did not work. Please try again.'), 'danger');
      setDigits(Array(DIGITS).fill(''));
      refs.current[0]?.focus();
    } finally {
      setChecking(false);
    }
  };

  /** Fills from index i onward, so typing, pasting and autofill all work. */
  const fill = (i: number, raw: string) => {
    const incoming = raw.replace(/\D/g, '');
    if (!incoming && raw !== '') return;
    const next = [...digits];
    if (!incoming) {
      next[i] = '';
    } else {
      incoming.slice(0, DIGITS - i).split('').forEach((d, k) => { next[i + k] = d; });
    }
    setDigits(next);
    const filledTo = Math.min(i + incoming.length, DIGITS - 1);
    if (incoming) refs.current[filledTo]?.focus();
    const code = next.join('');
    if (code.length === DIGITS && !checking) void verify(code);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const code = digits.join('');

  return (
    <AppPage scrollable padding="auth">
      <BackButton size={40} onClick={leave} style={{ marginTop: 6 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '26px 0 6px' }}>
        Check your email
      </h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '0 0 28px' }}>
        We sent a 6-digit code to <span style={{ color: 'var(--cl-ink)', fontWeight: 600 }}>{email}</span>.
        Enter it below. It can take a minute to arrive, so check spam too.
      </p>

      {/* Grid, because Ionic's input { width: 100% } reset breaks a flex row. */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DIGITS}, 1fr)`, gap: 10 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={d}
            onChange={(e) => fill(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={(e) => { e.preventDefault(); fill(i, e.clipboardData.getData('text')); }}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${i + 1}`}
            disabled={checking}
            style={{
              width: '100%', height: 60, borderRadius: 14,
              border: d ? '1.6px solid var(--cl-ink)' : '1px solid var(--cl-border)',
              background: 'var(--cl-surface)', textAlign: 'center',
              fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 24,
              color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: 13.5, color: 'var(--cl-muted-1)', marginTop: 22 }}>
        Didn&apos;t get it?{' '}
        {cooldown > 0 ? (
          <span style={{ color: 'var(--cl-muted-2)', fontWeight: 600 }}>
            Resend in 0:{String(cooldown).padStart(2, '0')}
          </span>
        ) : (
          <span
            onClick={() => { if (!sending) void send(true); }}
            style={{ color: 'var(--cl-ink)', fontWeight: 700, cursor: 'pointer' }}
          >
            {sending ? 'Sending…' : 'Resend code'}
          </span>
        )}
      </p>

      <AppButton
        onClick={() => void verify(code)}
        disabled={code.length < DIGITS || checking}
        loading={checking}
        loadingLabel="Checking…"
        style={{ marginTop: 22 }}
      >
        Confirm email
      </AppButton>

      <div style={{ flex: 1, minHeight: 24 }} />
      <p style={{ textAlign: 'center', fontSize: 13.5, marginBottom: 24 }}>
        <span onClick={leave} style={{ color: 'var(--cl-muted-1)', fontWeight: 600, cursor: 'pointer' }}>
          {state.back ? 'Not now' : 'Skip for now'}
        </span>
      </p>
    </AppPage>
  );
};

export default VerifyEmailPage;
