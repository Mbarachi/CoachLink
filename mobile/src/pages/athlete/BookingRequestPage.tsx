import React, { useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, ChoiceChip, InitialsAvatar,
  PageBody, PageHeader, SectionHeading, StatusBar, StatusPill, StickyFooter,
} from '@/components/ui';
import { fieldStyle } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', price: '₦12,000', initials: 'TA' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   price: '₦15,000', initials: 'CO' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', price: '₦9,000',  initials: 'EJ' },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   price: '₦18,000', initials: 'SD' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', price: '₦7,500',  initials: 'YB' },
];

const DATES = [
  { day: 'Mon', date: '13' }, { day: 'Wed', date: '15' },
  { day: 'Fri', date: '17' }, { day: 'Sat', date: '18' },
];
const TIMES = ['6:00 AM', '8:00 AM', '10:00 AM', '4:00 PM'];
const WEEK_OPTIONS = [2, 4, 8, 12];
const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const priceToNumber = (price: string) => Number(price.replace(/[^\d]/g, ''));
const formatNaira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

const BookingRequestPage: React.FC = () => {
  const history = useHistory();
  const { coachId } = useParams<{ coachId: string }>();
  const user = useAuthStore((s) => s.user);
  const isParent = user?.role === 'PARENT';
  const coach = COACHES[Number(coachId)] ?? COACHES[0];

  const [mode, setMode] = useState<'single' | 'package'>('single');
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(1);
  const [weeks, setWeeks] = useState(WEEK_OPTIONS[1]);
  const [pkgDays, setPkgDays] = useState<string[]>(['Wed', 'Fri']);
  const [note, setNote] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');

  const togglePkgDay = (d: string) => {
    setPkgDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const sessionCount = weeks * pkgDays.length;
  const totalPrice = useMemo(() => priceToNumber(coach.price) * sessionCount, [coach.price, sessionCount]);
  const submitDisabled = mode === 'package' && pkgDays.length === 0;

  const handleSubmit = () => {
    const state = mode === 'package'
      ? {
          coachId: coach.id, coachName: coach.name, coachInitials: coach.initials, coachSport: coach.sport,
          mode: 'package' as const, sessionsCount: sessionCount, totalPrice: formatNaira(totalPrice),
          schedule: pkgDays.join(' & '), time: TIMES[selectedTime], weeks,
        }
      : {
          coachId: coach.id, coachName: coach.name, coachInitials: coach.initials, coachSport: coach.sport,
          mode: 'single' as const, date: `${DATES[selectedDate].day} ${DATES[selectedDate].date}`, time: TIMES[selectedTime],
          price: coach.price,
        };
    history.push('/athlete/booking-success/new', state);
  };

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageHeader title="Request a session" />
      </div>

      <PageBody>
        {/* coach summary */}
        <AppCard padding={13} style={{ display: 'flex', alignItems: 'center', gap: 13, borderRadius: 16 }}>
          <InitialsAvatar initials={coach.initials} size={46} radius={13} fontSize={15} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{coach.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{coach.sport} · {coach.price}/session</div>
          </div>
        </AppCard>

        {/* single / package toggle */}
        <div style={{ display: 'flex', gap: 5, background: 'var(--cl-subtle)', borderRadius: 14, padding: 4, marginTop: 18 }}>
          {(['single', 'package'] as const).map(m => (
            <div
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, textAlign: 'center', padding: '11px 0', borderRadius: 11, cursor: 'pointer',
                fontWeight: 700, fontSize: 13.5,
                background: mode === m ? 'var(--cl-ink)' : 'transparent',
                color: mode === m ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
              }}
            >{m === 'single' ? 'Single session' : 'Weekly package'}</div>
          ))}
        </div>

        {/* child fields (parent only) */}
        {isParent && (
          <>
            <SectionHeading>Child details</SectionHeading>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Child's name" style={{ ...fieldStyle, flex: 2 }} />
              <input value={childAge} onChange={e => setChildAge(e.target.value)} placeholder="Age" style={{ ...fieldStyle, flex: 1 }} />
            </div>
          </>
        )}

        {mode === 'single' ? (
          <>
            {/* date picker */}
            <SectionHeading>Select date · May 2024</SectionHeading>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'space-between' }}>
              {DATES.map((d, i) => (
                <div key={i} onClick={() => setSelectedDate(i)} style={{
                  flex: 1, textAlign: 'center', padding: '11px 0', borderRadius: 13,
                  background: selectedDate === i ? 'var(--cl-accent)' : 'var(--cl-surface)',
                  border: `1px solid ${selectedDate === i ? 'var(--cl-accent)' : 'var(--cl-border)'}`,
                  cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 10, color: selectedDate === i ? 'var(--cl-surface)' : 'var(--cl-muted-2)' }}>{d.day}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: selectedDate === i ? 'var(--cl-surface)' : 'var(--cl-ink)', marginTop: 3 }}>{d.date}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* package length */}
            <SectionHeading>Package length</SectionHeading>
            <div style={{ display: 'flex', gap: 8 }}>
              {WEEK_OPTIONS.map(w => (
                <ChoiceChip
                  key={w}
                  active={weeks === w}
                  onClick={() => setWeeks(w)}
                  style={{ flex: 1, textAlign: 'center', fontWeight: 700, padding: '10px 0', border: '1px solid var(--cl-border)' }}
                >{w} wks</ChoiceChip>
              ))}
            </div>

            {/* package days */}
            <SectionHeading>Which days each week?</SectionHeading>
            <div style={{ display: 'flex', gap: 8 }}>
              {DAY_OPTIONS.map(d => (
                <ChoiceChip
                  key={d}
                  active={pkgDays.includes(d)}
                  onClick={() => togglePkgDay(d)}
                  style={{ flex: 1, textAlign: 'center', fontWeight: 700, padding: '10px 0', border: '1px solid var(--cl-border)' }}
                >{d[0]}</ChoiceChip>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cl-ink)', borderRadius: 16, padding: 16, marginTop: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--cl-bfae97)' }}>{sessionCount} sessions total</div>
                <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--cl-surface)', marginTop: 3 }}>{formatNaira(totalPrice)}</div>
              </div>
              <StatusPill tone="accent" style={{ color: 'var(--cl-ink)', padding: '6px 11px' }}>Package rate</StatusPill>
            </div>
          </>
        )}

        {/* time picker */}
        <SectionHeading>Select time</SectionHeading>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TIMES.map((t, i) => (
            <ChoiceChip
              key={t}
              active={selectedTime === i}
              onClick={() => setSelectedTime(i)}
              style={selectedTime === i ? { border: 'none' } : undefined}
            >{t}</ChoiceChip>
          ))}
        </div>

        {/* note */}
        <SectionHeading>
          Note for the coach <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>(optional)</span>
        </SectionHeading>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Any goals or requirements?"
          style={{ width: '100%', height: 74, borderRadius: 'var(--cl-radius-input)', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
        />

        {/* info note */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 13, padding: 13, marginTop: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
          <span style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)' }}>You'll only pay after {coach.name} accepts. Payment is handled securely via Paystack.</span>
        </div>

        <div style={{ height: 90 }} />
      </PageBody>

      <StickyFooter style={{ paddingLeft: 0, paddingRight: 0 }}>
        {mode === 'package' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{sessionCount} sessions</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{formatNaira(totalPrice)}</span>
          </div>
        )}
        <AppButton
          size="md"
          onClick={handleSubmit}
          disabled={submitDisabled}
          style={submitDisabled ? { background: 'var(--cl-subtle)', color: 'var(--cl-muted-2)', opacity: 1 } : undefined}
        >
          Send request
        </AppButton>
      </StickyFooter>
    </AppPage>
  );
};

export default BookingRequestPage;
