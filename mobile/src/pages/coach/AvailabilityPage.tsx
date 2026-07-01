import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Toggle: React.FC<{ on: boolean; onChange: () => void }> = ({ on, onChange }) => (
  <div onClick={onChange} style={{ width: 42, height: 24, borderRadius: '999px', background: on ? 'var(--cl-accent)' : 'var(--cl-border)', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: 'var(--cl-surface)', transition: 'left .15s' }} />
  </div>
);

const INITIAL_DAYS = [
  { label: 'Monday',    active: true,  time: '6:00 – 10:00 AM' },
  { label: 'Wednesday', active: true,  time: '6:00 – 9:00 AM' },
  { label: 'Friday',    active: true,  time: '4:00 – 7:00 PM' },
  { label: 'Saturday',  active: false, time: 'Off' },
  { label: 'Sunday',    active: false, time: 'Off' },
];

const SLOTS = ['6:00 AM', '7:00 AM', '9:00 AM'];
const OFF_SLOTS = ['8:00 AM'];

const AvailabilityPage: React.FC = () => {
  const history = useHistory();
  const [days, setDays] = useState(INITIAL_DAYS);

  const toggleDay = (i: number) => setDays(d => d.map((x, j) => j === i ? { ...x, active: !x.active, time: !x.active ? '6:00 – 9:00 AM' : 'Off' } : x));

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ flexShrink: 0, padding: '0 var(--cl-px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 4px' }}>Availability</h1>
            <p style={{ fontSize: 13, color: 'var(--cl-muted-1)', margin: '0 0 6px' }}>Set the days and times you're open to coach.</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px var(--cl-px) 12px' }}>
            {/* day toggles */}
            <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, overflow: 'hidden' }}>
              {days.map((d, i) => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', padding: 15, borderBottom: i < days.length - 1 ? '1px solid var(--cl-subtle)' : 'none' }}>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: d.active ? 'var(--cl-ink)' : 'var(--cl-muted-2)' }}>{d.label}</span>
                  <span style={{ fontSize: 12.5, color: d.active ? 'var(--cl-muted-1)' : 'var(--cl-muted-line)', marginRight: 11 }}>{d.time}</span>
                  <Toggle on={d.active} onChange={() => toggleDay(i)} />
                </div>
              ))}
            </div>

            {/* time slots for Wednesday */}
            <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '20px 0 10px' }}>Wednesday slots</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SLOTS.map(s => (
                <span key={s} style={{ fontSize: 13, fontWeight: 600, background: 'var(--cl-ink)', color: 'var(--cl-accent)', padding: '9px 15px', borderRadius: 11 }}>{s}</span>
              ))}
              {OFF_SLOTS.map(s => (
                <span key={s} style={{ fontSize: 13, fontWeight: 600, color: 'var(--cl-muted-3)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '9px 15px', borderRadius: 11 }}>{s}</span>
              ))}
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cl-muted-3)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '9px 15px', borderRadius: 11, cursor: 'pointer' }}>+ Add</span>
            </div>

            <div style={{ height: 90 }} />
          </div>

          {/* sticky footer */}
          <div style={{ flexShrink: 0, padding: '14px var(--cl-px) 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            <button onClick={() => history.push('/coach/dashboard')} style={{ width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>Save availability</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AvailabilityPage;
