import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  AppButton, AppCard, AppInput, AppPage, BackButton, FilePicker, FormLabel, LoadingOverlay, LoadingState,
  VerifyEmailBanner,
} from '@/components/ui';
import { useCreateCoachProfile, useSports } from '@/hooks';
import { uploadCoachFiles } from '@/services/firebase/uploads';
import { getErrorMessage } from '@/lib/apiError';
import { setBackOverride } from '@/lib/backNavigation';
import { DAY_LABELS, SLOTS } from '@/lib/slots';
import { EMPTY_DRAFT, type CoachDraft } from '@/lib/coachDraft';
import { authService, coachesService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

/** Monday first, the way a coach thinks about their week. */
const WEEK = [1, 2, 3, 4, 5, 6, 0] as const;

const STEP_LABELS = ['Sport & experience', 'Venue & pricing', 'Availability', 'Verification & review'];
const TOTAL_STEPS = STEP_LABELS.length;

const Toggle: React.FC<{ on: boolean; onChange: () => void }> = ({ on, onChange }) => (
  <div onClick={onChange} style={{ width: 42, height: 24, borderRadius: 'var(--cl-radius-chip)', background: on ? 'var(--cl-accent)' : 'var(--cl-border)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: 'var(--cl-surface)', transition: 'left .15s' }} />
  </div>
);

const ReviewRow: React.FC<{ label: string; value: string; bold?: boolean; last?: boolean }> = ({ label, value, bold, last }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--cl-subtle)' }}>
    <span style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: bold ? 700 : 600, color: 'var(--cl-ink)' }}>{value}</span>
  </div>
);

const CoachOnboardingPage: React.FC = () => {
  const history = useHistory();
  const fromSettings = useLocation<{ from?: string } | undefined>().state?.from === 'settings';
  const showToast = useUiStore((s) => s.showToast);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [step, setStep] = useState(EMPTY_DRAFT.step);
  // False until the saved draft has been read, so a returning coach never
  // sees an empty form flash up and then fill itself in.
  const [loaded, setLoaded] = useState(false);

  const sportsQuery = useSports();
  const sports = sportsQuery.data ?? [];
  const createProfile = useCreateCoachProfile();

  const [sportId, setSportId] = useState<string | null>(EMPTY_DRAFT.sportId);
  const chosenSport = sportId ?? sports[0]?.id ?? null;
  const sportName = sports.find((s) => s.id === chosenSport)?.name ?? '—';

  const [experience, setExperience] = useState(EMPTY_DRAFT.experience);
  const [about, setAbout] = useState(EMPTY_DRAFT.about);

  const [venue, setVenue] = useState(EMPTY_DRAFT.venue);
  const [price, setPrice] = useState(EMPTY_DRAFT.price);

  // Indexed by JS weekday (0 = Sunday), because that is what Availability is
  // keyed on and what the athlete's date picker compares against.
  const [openDays, setOpenDays] = useState<number[]>(EMPTY_DRAFT.openDays);
  const toggleDay = (day: number) =>
    setOpenDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));

  // The files themselves, not just a preview and a boolean — the previous
  // version read the photo into a data URL and discarded the ID entirely.
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  // Picks up where they left off — on this phone or any other, since the
  // draft lives on the server. With no draft yet, saving the empty one is what
  // marks the account as partway through, so sign-in can bring them back here.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      let draft: CoachDraft | null = null;
      try {
        draft = await coachesService.getMyDraft();
      } catch {
        // Offline: start blank rather than strand them on a spinner.
      }
      if (cancelled) return;
      const d = draft ?? EMPTY_DRAFT;
      setStep(d.step);
      setSportId(d.sportId);
      setExperience(d.experience);
      setAbout(d.about);
      setVenue(d.venue);
      setPrice(d.price);
      setOpenDays(d.openDays);
      setLoaded(true);
      useAuthStore.getState().setCoachDraftPending(true);
      if (!draft) void coachesService.saveDraft(EMPTY_DRAFT).catch(() => undefined);
    })();
    return () => { cancelled = true; };
  }, []);

  /** Saved on every step change, so Continue and Back both keep what was typed. */
  const saveAt = (nextStep: number) => {
    void coachesService.saveDraft({
      step: nextStep, sportId: chosenSport, experience, about, venue, price, openDays,
    }).catch(() => {
      showToast("Couldn't save your progress — check your connection.", 'warning');
    });
  };

  const back = () => {
    if (step === 0 && fromSettings) {
      // An athlete who only came to look. Leaving from the first step drops
      // the draft, or every launch after this would bring them back here.
      void coachesService.discardDraft().catch(() => undefined);
      useAuthStore.getState().setCoachDraftPending(false);
      history.goBack();
    } else if (step === 0) {
      // Role selection replaced itself in the history stack on the way here,
      // so goBack() would skip past it to verification.
      history.replace('/auth/role');
    } else {
      saveAt(step - 1);
      setStep(step - 1);
    }
  };
  // The phone's back button does what the on-screen one does: one step back,
  // and from the first step, back to wherever they came from.
  const backRef = useRef(back);
  backRef.current = back;
  useEffect(() => {
    setBackOverride('/auth/coach-onboarding', () => backRef.current());
    return () => setBackOverride('/auth/coach-onboarding', null);
  }, []);

  const next = () => {
    if (step === 0 && !experience.replace(/[^\d]/g, '')) {
      showToast('Enter your years of experience.', 'warning');
      return;
    }
    const nextStep = Math.min(step + 1, TOTAL_STEPS - 1);
    saveAt(nextStep);
    setStep(nextStep);
  };

  const finish = async () => {
    if (!chosenSport) {
      showToast('Pick the sport you coach.', 'warning');
      return;
    }
    if (!experience.replace(/[^\d]/g, '')) {
      showToast('Enter your years of experience.', 'warning');
      return;
    }
    if (!venue.trim() || !about.trim() || !price.trim()) {
      showToast('Fill in your sport, venue, price and bio first.', 'warning');
      return;
    }
    if (!photoFile) {
      showToast('Add a profile photo — athletes see it on your listing.', 'warning');
      return;
    }
    if (!idFile) {
      showToast('Upload a government ID. Your profile cannot be verified without it.', 'warning');
      return;
    }

    // The server refuses an unconfirmed email, but only after both files have
    // gone up. Asking first saves the upload and says what to do instead.
    if (!(await authService.refreshVerification().catch(() => true))) {
      showToast('Confirm your email first. Use "Resend link" above if you can\'t find it.', 'warning');
      return;
    }

    try {
      setUploadPercent(0);
      setUploading(true);
      const uploads = await uploadCoachFiles(photoFile, idFile, setUploadPercent);

      await createProfile.mutateAsync({
        ...uploads,
        bio: about.trim(),
        yearsOfExperience: Number(experience.replace(/[^\d]/g, '')),
        sessionRate: Number(price.replace(/[^\d]/g, '')),
        venue: venue.trim(),
        sportIds: [chosenSport],
        availability: Object.fromEntries(openDays.map(day => [String(day), SLOTS])),
      });
      // Creating a profile promotes the account to COACH server-side.
      // The server deletes the draft in the same write.
      updateUser({ role: 'COACH' });
      useAuthStore.getState().setCoachDraftPending(false);
      showToast('Submitted — an admin will review your profile.', 'success');
      history.replace('/coach/dashboard');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not submit your profile.'), 'danger');
    } finally {
      setUploading(false);
    }
  };

  // Same AppPage either way, so Ionic sees one page whose contents change —
  // not a page swapped out from under it, which is what stranded the spinner.
  if (!loaded) {
    return (
      <AppPage padding="auth" center>
        <LoadingState label="Picking up where you left off…" />
      </AppPage>
    );
  }

  return (
    <AppPage scrollable padding="auth">
      <LoadingOverlay
        show={uploading || createProfile.isPending}
        label={uploading ? `Uploading your documents… ${uploadPercent}%` : 'Submitting for review…'}
        hint={uploading ? 'Keep the app open — this can take a moment on a slow connection.' : undefined}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '6px 0 4px' }}>
        <BackButton onClick={back} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em', color: 'var(--cl-muted-2)' }}>STEP {step + 1} OF {TOTAL_STEPS}</div>
          <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)', marginTop: 2 }}>{STEP_LABELS[step]}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, margin: '14px 0 4px' }}>
        {STEP_LABELS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 5, borderRadius: 'var(--cl-radius-chip)', background: step >= i ? 'var(--cl-accent)' : 'var(--cl-border)' }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 0 12px' }}>

        {/* Step 0: Sport & experience */}
        {step === 0 && (
          <>
            <FormLabel>Which sport do you coach?</FormLabel>
            <div style={{ display: 'flex', gap: 9 }}>
              {sports.map((s) => {
                const active = chosenSport === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSportId(s.id)}
                    style={{ flex: 1, background: active ? 'var(--cl-ink-fill)' : 'var(--cl-surface)', border: active ? 'none' : '1px solid var(--cl-border)', borderRadius: 15, padding: 14, textAlign: 'center', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 22 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: active ? 'var(--cl-surface)' : 'var(--cl-ink)', marginTop: 6 }}>{s.name}</div>
                  </div>
                );
              })}
            </div>

            <AppInput label="Years of experience" value={experience} onChange={setExperience} placeholder="e.g. 5" labelStyle={{ margin: '20px 0 7px' }} />

            <FormLabel style={{ margin: '15px 0 7px' }}>About you</FormLabel>
            <textarea
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder="Tell athletes about your coaching style and experience…"
              style={{ width: '100%', height: 96, borderRadius: 'var(--cl-radius-input)', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
          </>
        )}

        {/* Step 1: Venue & pricing */}
        {step === 1 && (
          <>
            <AppInput label="Training venue" value={venue} onChange={setVenue} placeholder="e.g. Festival Hotel Pool" />

            <FormLabel style={{ margin: '16px 0 7px' }}>Venue area</FormLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52, borderRadius: 'var(--cl-radius-input)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '0 15px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cl-accent)', flexShrink: 0 }} />
              <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cl-ink)' }}>Amuwo Odofin, Lagos</span>
            </div>

            <AppInput label="Price per session" value={price} onChange={setPrice} placeholder="₦12,000" labelStyle={{ margin: '16px 0 7px' }} />

            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 13, padding: 12, marginTop: 11 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--cl-ink-fill)', color: 'var(--cl-on-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>i</div>
              <span style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--cl-muted-3)' }}>Recommended for {sportName.toLowerCase()}: ₦5,000 – ₦15,000 per session.</span>
            </div>
          </>
        )}

        {/* Step 2: Availability */}
        {step === 2 && (
          <>
            <p style={{ fontSize: 13, color: 'var(--cl-muted-1)', margin: '0 0 14px' }}>Toggle the days you're generally available. You can fine-tune exact hours later.</p>
            <AppCard padding={0} style={{ borderRadius: 16, overflow: 'hidden' }}>
              {WEEK.map((day, i) => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', padding: 14, borderBottom: i < WEEK.length - 1 ? '1px solid var(--cl-subtle)' : 'none' }}>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: openDays.includes(day) ? 'var(--cl-ink)' : 'var(--cl-muted-2)' }}>
                    {DAY_LABELS[day]}
                  </span>
                  <Toggle on={openDays.includes(day)} onChange={() => toggleDay(day)} />
                </div>
              ))}
            </AppCard>
            <p style={{ fontSize: 11.5, lineHeight: 1.45, color: 'var(--cl-muted-2)', margin: '11px 2px 0' }}>
              Every hour from 9am to 7pm is offered on the days you pick. Narrow them
              down any time from Availability on your dashboard.
            </p>
          </>
        )}

        {/* Step 3: Verification & review */}
        {step === 3 && (
          <>
            <VerifyEmailBanner required />
            <FormLabel>Profile photo <span style={{ color: 'var(--cl-accent)' }}>*</span></FormLabel>
            <FilePicker
              value={photoFile}
              onChange={setPhotoFile}
              accept={['image/jpeg', 'image/png', 'image/webp']}
              maxBytes={5 * 1024 * 1024}
              allowCamera
              hint="JPEG or PNG, up to 5MB"
            />

            <FormLabel style={{ margin: '20px 0 8px' }}>Government-issued ID <span style={{ color: 'var(--cl-accent)' }}>*</span></FormLabel>
            <FilePicker
              value={idFile}
              onChange={setIdFile}
              accept={['image/jpeg', 'image/png', 'application/pdf']}
              maxBytes={5 * 1024 * 1024}
              allowCamera
              shape="wide"
              hint="Photo or PDF."
            />

            <FormLabel style={{ margin: '22px 0 9px' }}>Review</FormLabel>
            <AppCard padding="4px 16px" style={{ borderRadius: 16 }}>
              <ReviewRow label="Sport" value={sportName} />
              <ReviewRow label="Venue" value={venue || '—'} />
              <ReviewRow label="Price / session" value={price || '—'} bold last />
            </AppCard>
          </>
        )}
      </div>

      <div style={{ flexShrink: 0, padding: '14px 0 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
        {step === TOTAL_STEPS - 1 ? (
          <AppButton
            size="md"
            loading={uploading || createProfile.isPending}
            loadingLabel={uploading ? 'Uploading…' : 'Submitting…'}
            onClick={() => void finish()}
          >
            Submit for verification
          </AppButton>
        ) : (
          <AppButton size="md" onClick={next}>Continue</AppButton>
        )}
      </div>
    </AppPage>
  );
};

export default CoachOnboardingPage;
