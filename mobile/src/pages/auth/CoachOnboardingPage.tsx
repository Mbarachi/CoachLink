import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppCard, AppInput, AppPage, BackButton, FormLabel, StatusBar } from '@/components/ui';

const STEP_LABELS = ['Sport & experience', 'Venue & pricing', 'Availability', 'Verification & review'];
const TOTAL_STEPS = STEP_LABELS.length;

const SPORTS = [
  { key: 'Swimming', emoji: '🏊' },
  { key: 'Tennis', emoji: '🎾' },
] as const;

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
  const [step, setStep] = useState(0);

  const [sport, setSport] = useState<'Swimming' | 'Tennis'>('Swimming');
  const [experience, setExperience] = useState('5 years');
  const [about, setAbout] = useState('');

  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState('');

  const [days, setDays] = useState([
    { label: 'Monday', active: true },
    { label: 'Wednesday', active: true },
    { label: 'Friday', active: true },
    { label: 'Saturday', active: false },
    { label: 'Sunday', active: false },
  ]);
  const toggleDay = (i: number) => setDays(d => d.map((x, j) => (j === i ? { ...x, active: !x.active } : x)));

  const [photo, setPhoto] = useState<string | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);

  const back = () => {
    if (step === 0) history.goBack();
    else setStep(s => s - 1);
  };
  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const finish = () => history.replace('/coach/dashboard');

  return (
    <AppPage scrollable padding="auth">
      <StatusBar />

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
              {SPORTS.map((s) => {
                const active = sport === s.key;
                return (
                  <div
                    key={s.key}
                    onClick={() => setSport(s.key)}
                    style={{ flex: 1, background: active ? 'var(--cl-ink)' : 'var(--cl-surface)', border: active ? 'none' : '1px solid var(--cl-border)', borderRadius: 15, padding: 14, textAlign: 'center', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 22 }}>{s.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: active ? 'var(--cl-surface)' : 'var(--cl-ink)', marginTop: 6 }}>{s.key}</div>
                  </div>
                );
              })}
            </div>

            <AppInput label="Years of experience" value={experience} onChange={setExperience} labelStyle={{ margin: '20px 0 7px' }} />

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
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--cl-ink)', color: 'var(--cl-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>i</div>
              <span style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--cl-muted-3)' }}>Recommended for {sport.toLowerCase()}: ₦5,000 – ₦15,000 per session.</span>
            </div>
          </>
        )}

        {/* Step 2: Availability */}
        {step === 2 && (
          <>
            <p style={{ fontSize: 13, color: 'var(--cl-muted-1)', margin: '0 0 14px' }}>Toggle the days you're generally available. You can fine-tune exact hours later.</p>
            <AppCard padding={0} style={{ borderRadius: 16, overflow: 'hidden' }}>
              {days.map((d, i) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', padding: 14, borderBottom: i < days.length - 1 ? '1px solid var(--cl-subtle)' : 'none' }}>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: d.active ? 'var(--cl-ink)' : 'var(--cl-muted-2)' }}>{d.label}</span>
                  <Toggle on={d.active} onChange={() => toggleDay(i)} />
                </div>
              ))}
            </AppCard>
            <p style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', margin: '11px 2px 0' }}>You can set exact time slots per day later from Availability.</p>
          </>
        )}

        {/* Step 3: Verification & review */}
        {step === 3 && (
          <>
            <FormLabel>Profile photo</FormLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: photo ? undefined : 'var(--cl-subtle)', backgroundImage: photo ? `url(${photo})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', border: '1.5px dashed var(--cl-muted-line)', flexShrink: 0 }} />
              <label style={{ border: '1.6px solid var(--cl-ink)', background: 'var(--cl-surface)', borderRadius: 12, padding: '10px 16px', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 13, color: 'var(--cl-ink)', cursor: 'pointer' }}>
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setPhoto(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>

            <FormLabel style={{ margin: '20px 0 8px' }}>Government-issued ID</FormLabel>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1.5px dashed var(--cl-muted-line)', borderRadius: 14, padding: 16, background: 'var(--cl-surface)', cursor: 'pointer' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: idUploaded ? 'var(--cl-success-bg)' : 'var(--cl-subtle)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--cl-ink)' }}>{idUploaded ? 'ID uploaded' : 'Upload ID for verification'}</div>
                <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 1 }}>Reviewed manually, usually within 24 hours.</div>
              </div>
              <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={(e) => setIdUploaded(!!e.target.files?.[0])} />
            </label>

            <FormLabel style={{ margin: '22px 0 9px' }}>Review</FormLabel>
            <AppCard padding="4px 16px" style={{ borderRadius: 16 }}>
              <ReviewRow label="Sport" value={sport} />
              <ReviewRow label="Venue" value={venue || '—'} />
              <ReviewRow label="Price / session" value={price || '—'} bold last />
            </AppCard>
          </>
        )}
      </div>

      <div style={{ flexShrink: 0, padding: '14px 0 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
        {step === TOTAL_STEPS - 1 ? (
          <AppButton size="md" onClick={finish}>Submit for verification</AppButton>
        ) : (
          <AppButton size="md" variant="ink" onClick={next}>Continue</AppButton>
        )}
      </div>
    </AppPage>
  );
};

export default CoachOnboardingPage;
