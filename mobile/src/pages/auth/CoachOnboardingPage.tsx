import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const STEP_LABELS = ['Sport & experience', 'Venue & pricing', 'Availability', 'Verification & review'];
const TOTAL_STEPS = STEP_LABELS.length;

const SPORTS = [
  { key: 'Swimming', emoji: '🏊' },
  { key: 'Tennis', emoji: '🎾' },
] as const;

const Toggle: React.FC<{ on: boolean; onChange: () => void }> = ({ on, onChange }) => (
  <div onClick={onChange} style={{ width: 42, height: 24, borderRadius: 999, background: on ? 'var(--cl-accent)' : 'var(--cl-border)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: 'var(--cl-surface)', transition: 'left .15s' }} />
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', height: 52, borderRadius: 14, border: '1px solid var(--cl-border)',
  background: 'var(--cl-surface)', padding: '0 15px', fontFamily: 'var(--cl-font-body)',
  fontSize: 14.5, color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', marginBottom: 7, display: 'block',
};

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
    <IonPage>
      <IonContent style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 26px', fontFamily: 'var(--cl-font-body)', minHeight: '100%' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
            <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '6px 0 4px' }}>
            <button onClick={back} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}>‹</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em', color: 'var(--cl-muted-2)' }}>STEP {step + 1} OF {TOTAL_STEPS}</div>
              <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)', marginTop: 2 }}>{STEP_LABELS[step]}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, margin: '14px 0 4px' }}>
            {STEP_LABELS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: step >= i ? 'var(--cl-accent)' : 'var(--cl-border)' }} />
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 0 12px' }}>

            {/* Step 0: Sport & experience */}
            {step === 0 && (
              <>
                <label style={labelStyle}>Which sport do you coach?</label>
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

                <label style={{ ...labelStyle, margin: '20px 0 7px' }}>Years of experience</label>
                <input value={experience} onChange={e => setExperience(e.target.value)} style={inputStyle} />

                <label style={{ ...labelStyle, margin: '15px 0 7px' }}>About you</label>
                <textarea
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Tell athletes about your coaching style and experience…"
                  style={{ width: '100%', height: 96, borderRadius: 14, border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 14, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                />
              </>
            )}

            {/* Step 1: Venue & pricing */}
            {step === 1 && (
              <>
                <label style={labelStyle}>Training venue</label>
                <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Festival Hotel Pool" style={inputStyle} />

                <label style={{ ...labelStyle, margin: '16px 0 7px' }}>Venue area</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52, borderRadius: 14, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '0 15px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cl-accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cl-ink)' }}>Amuwo Odofin, Lagos</span>
                </div>

                <label style={{ ...labelStyle, margin: '16px 0 7px' }}>Price per session</label>
                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="₦12,000" style={inputStyle} />

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
                <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, overflow: 'hidden' }}>
                  {days.map((d, i) => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', padding: 14, borderBottom: i < days.length - 1 ? '1px solid var(--cl-subtle)' : 'none' }}>
                      <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: d.active ? 'var(--cl-ink)' : 'var(--cl-muted-2)' }}>{d.label}</span>
                      <Toggle on={d.active} onChange={() => toggleDay(i)} />
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', margin: '11px 2px 0' }}>You can set exact time slots per day later from Availability.</p>
              </>
            )}

            {/* Step 3: Verification & review */}
            {step === 3 && (
              <>
                <label style={labelStyle}>Profile photo</label>
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

                <label style={{ ...labelStyle, margin: '20px 0 8px' }}>Government-issued ID</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1.5px dashed var(--cl-muted-line)', borderRadius: 14, padding: 16, background: 'var(--cl-surface)', cursor: 'pointer' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: idUploaded ? 'var(--cl-success-bg)' : 'var(--cl-subtle)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--cl-ink)' }}>{idUploaded ? 'ID uploaded' : 'Upload ID for verification'}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 1 }}>Reviewed manually, usually within 24 hours.</div>
                  </div>
                  <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={(e) => setIdUploaded(!!e.target.files?.[0])} />
                </label>

                <label style={{ ...labelStyle, margin: '22px 0 9px' }}>Review</label>
                <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, padding: '4px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--cl-subtle)' }}>
                    <span style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Sport</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cl-ink)' }}>{sport}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--cl-subtle)' }}>
                    <span style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Venue</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cl-ink)' }}>{venue || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                    <span style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Price / session</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cl-ink)' }}>{price || '—'}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ flexShrink: 0, padding: '14px 0 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            {step === TOTAL_STEPS - 1 ? (
              <button onClick={finish} style={{ width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-accent)', color: '#fff', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>
                Submit for verification
              </button>
            ) : (
              <button onClick={next} style={{ width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-ink)', color: 'var(--cl-surface)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>
                Continue
              </button>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CoachOnboardingPage;
