import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, PageBody, PageTitle,
  SectionHeading, StatusBar, StickyFooter, Toggle,
} from '@/components/ui';

const INITIAL_DAYS = [
  { label: 'Monday',    active: true,  time: '6:00 – 10:00 AM' },
  { label: 'Wednesday', active: true,  time: '6:00 – 9:00 AM' },
  { label: 'Friday',    active: true,  time: '4:00 – 7:00 PM' },
  { label: 'Saturday',  active: false, time: 'Off' },
  { label: 'Sunday',    active: false, time: 'Off' },
];

const SLOTS = ['6:00 AM', '7:00 AM', '9:00 AM'];
const OFF_SLOTS = ['8:00 AM'];

const chipStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, padding: '9px 15px', borderRadius: 11,
};

const AvailabilityPage: React.FC = () => {
  const history = useHistory();
  const [days, setDays] = useState(INITIAL_DAYS);

  const toggleDay = (i: number) => setDays(d => d.map((x, j) => j === i ? { ...x, active: !x.active, time: !x.active ? '6:00 – 9:00 AM' : 'Off' } : x));

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageTitle style={{ margin: '8px 0 4px' }}>Availability</PageTitle>
        <p style={{ fontSize: 13, color: 'var(--cl-muted-1)', margin: '0 0 6px' }}>Set the days and times you're open to coach.</p>
      </div>

      <PageBody style={{ paddingTop: 10 }}>
        {/* day toggles */}
        <AppCard padding={0} style={{ borderRadius: 16, overflow: 'hidden' }}>
          {days.map((d, i) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', padding: 15, borderBottom: i < days.length - 1 ? '1px solid var(--cl-subtle)' : 'none' }}>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: d.active ? 'var(--cl-ink)' : 'var(--cl-muted-2)' }}>{d.label}</span>
              <span style={{ fontSize: 12.5, color: d.active ? 'var(--cl-muted-1)' : 'var(--cl-muted-line)', marginRight: 11 }}>{d.time}</span>
              <Toggle on={d.active} onChange={() => toggleDay(i)} />
            </div>
          ))}
        </AppCard>

        {/* time slots for Wednesday */}
        <SectionHeading style={{ margin: '20px 0 10px' }}>Wednesday slots</SectionHeading>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SLOTS.map(s => (
            <span key={s} style={{ ...chipStyle, background: 'var(--cl-ink)', color: 'var(--cl-accent)' }}>{s}</span>
          ))}
          {OFF_SLOTS.map(s => (
            <span key={s} style={{ ...chipStyle, color: 'var(--cl-muted-3)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)' }}>{s}</span>
          ))}
          <span style={{ ...chipStyle, color: 'var(--cl-muted-3)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', cursor: 'pointer' }}>+ Add</span>
        </div>

        <div style={{ height: 90 }} />
      </PageBody>

      <StickyFooter style={{ paddingLeft: 0, paddingRight: 0 }}>
        <AppButton size="md" onClick={() => history.push('/coach/dashboard')}>Save availability</AppButton>
      </StickyFooter>
    </AppPage>
  );
};

export default AvailabilityPage;
