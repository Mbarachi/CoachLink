import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton,
  AppCard,
  AppPage,
  ChoiceChip,
  InitialsAvatar,
  PageBody,
  PageHeader,
  QueryState,
  SectionHeading,
  StatusPill,
  StickyFooter,
} from '@/components/ui';
import { fieldStyle } from '@/components/ui';
import { useCoach, useCreateBookingRequest } from '@/hooks';
import { coachInitials, coachName } from '@/lib/coach';
import { getErrorMessage } from '@/lib/apiError';
import { requestPushPermission } from '@/lib/push';
import { DAY_NAMES, formatNaira } from '@/lib/format';
import { SLOTS, hasNoAvailability, slotLabel, slotsOnDate } from '@/lib/slots';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

/** Value is what the API wants (24h), label is what the athlete sees. */
const WEEK_OPTIONS = [2, 4, 8, 12];
/** The API caps a request at 24 sessions; weeks * days must stay under it. */
const MAX_SESSIONS = 24;

/** The next 14 selectable days, so the picker never offers a date in the past. */
function upcomingDates(count = 14) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return {
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      day: DAY_NAMES[d.getDay()],
      date: String(d.getDate()),
    };
  });
}

const BookingRequestPage: React.FC = () => {
  const history = useHistory();
  const { coachId } = useParams<{ coachId: string }>();
  const user = useAuthStore((s) => s.user);
  const showToast = useUiStore((s) => s.showToast);
  const isParent = user?.role === 'PARENT';

  const coachQuery = useCoach(coachId);
  const coach = coachQuery.data;
  const createRequest = useCreateBookingRequest();

  const dates = useMemo(() => upcomingDates(), []);

  const [mode, setMode] = useState<'single' | 'package'>('single');
  const [sportId, setSportId] = useState<string | null>(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [weeks, setWeeks] = useState(WEEK_OPTIONS[1]);
  const [pkgDays, setPkgDays] = useState<number[]>([3, 5]);
  const [note, setNote] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');

  const availability = coach?.profile.availability;

  /** Weekdays the coach opens at all. A coach who set nothing stays fully open. */
  const openWeekdays = useMemo(() => {
    if (hasNoAvailability(availability)) return new Set(DAY_NAMES.map((_, i) => i));
    return new Set(
      Object.entries(availability ?? {})
        .filter(([, times]) => times.length > 0)
        .map(([day]) => Number(day)),
    );
  }, [availability]);

  /**
   * For a package the start time has to work on *every* chosen day, so this is
   * their intersection — offering a time that only suits Monday would produce
   * a request the server then rejects.
   */
  const availableTimes = useMemo(() => {
    if (hasNoAvailability(availability)) return SLOTS;
    if (mode === 'single') {
      return slotsOnDate(availability, new Date(`${dates[dateIndex].iso}T00:00:00`));
    }
    if (pkgDays.length === 0) return [];
    return pkgDays.reduce<string[]>((shared, day, i) => {
      const times = availability?.[String(day)] ?? [];
      return i === 0 ? times : shared.filter((t) => times.includes(t));
    }, []);
  }, [availability, mode, dates, dateIndex, pkgDays]);

  // Keeps the choice valid as the day or package days change under it.
  useEffect(() => {
    if (availableTimes.length === 0) { setStartTime(''); return; }
    if (!availableTimes.includes(startTime)) setStartTime(availableTimes[0]);
  }, [availableTimes, startTime]);

  const sports = coach?.sports ?? [];
  const chosenSport = sportId ?? sports[0]?.id ?? null;
  const rate = coach?.profile.sessionRate ?? 0;
  const sessionCount = mode === 'package' ? weeks * pkgDays.length : 1;
  const totalPrice = rate * sessionCount;
  const overCap = mode === 'package' && sessionCount > MAX_SESSIONS;

  const togglePkgDay = (d: number) =>
    setPkgDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const submitDisabled =
    createRequest.isPending || !chosenSport || !startTime
    || (mode === 'package' && (pkgDays.length === 0 || overCap));

  const handleSubmit = async () => {
    if (!coach || !chosenSport) return;

    if (isParent && (!childName.trim() || !childAge.trim())) {
      showToast("Enter the child's name and age.", 'warning');
      return;
    }

    try {
      const request = await createRequest.mutateAsync({
        coachId: coach.profile.id,
        sportId: chosenSport,
        mode: mode === 'package' ? 'PACKAGE' : 'SINGLE',
        startDate: dates[dateIndex].iso,
        startTime,
        ...(mode === 'package' ? { weeks, daysOfWeek: [...pkgDays].sort((a, b) => a - b) } : {}),
        ...(note.trim() ? { notes: note.trim() } : {}),
        ...(isParent ? { childName: childName.trim(), childAge: Number(childAge) } : {}),
      });

      // The one moment "tell me when the coach replies" needs no explaining,
      // which is the only sensible time to spend iOS's single permission
      // prompt. Not awaited — a refused or slow prompt must not hold up the
      // screen that confirms the request was sent.
      void requestPushPermission();

      history.push(`/athlete/booking-success/${request.id}`, {
        coachName: coachName(coach),
        coachInitials: coachInitials(coach),
        sessionCount: request.sessionCount,
        totalPrice: formatNaira(request.totalAmount),
      });
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not send your request. Please try again.'), 'danger');
    }
  };

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Request a session" />
      </div>

      <PageBody>
        <QueryState isLoading={coachQuery.isPending} error={coachQuery.error} onRetry={() => void coachQuery.refetch()}>
          {!coach ? null : (
            <>
              <AppCard padding={13} style={{ display: 'flex', alignItems: 'center', gap: 13, borderRadius: 16 }}>
                <InitialsAvatar initials={coachInitials(coach)} size={46} radius={13} fontSize={15} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{coachName(coach)}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
                    {coach.sports.map((s) => s.name).join(' & ')} · {formatNaira(rate)}/session
                  </div>
                </div>
              </AppCard>

              <div style={{ display: 'flex', gap: 5, background: 'var(--cl-subtle)', borderRadius: 14, padding: 4, marginTop: 18 }}>
                {(['single', 'package'] as const).map(m => (
                  <div
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      flex: 1, textAlign: 'center', padding: '11px 0', borderRadius: 11, cursor: 'pointer',
                      fontWeight: 700, fontSize: 13.5,
                      background: mode === m ? 'var(--cl-ink-fill)' : 'transparent',
                      color: mode === m ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
                    }}
                  >{m === 'single' ? 'Single session' : 'Weekly package'}</div>
                ))}
              </div>

              {/* Only worth asking when the coach actually teaches more than one. */}
              {sports.length > 1 && (
                <>
                  <SectionHeading>Which sport?</SectionHeading>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {sports.map(s => (
                      <ChoiceChip
                        key={s.id}
                        active={chosenSport === s.id}
                        onClick={() => setSportId(s.id)}
                        style={{ flex: 1, textAlign: 'center', fontWeight: 700, padding: '10px 0', border: '1px solid var(--cl-border)' }}
                      >{s.icon} {s.name}</ChoiceChip>
                    ))}
                  </div>
                </>
              )}

              {isParent && (
                <>
                  <SectionHeading>Child details</SectionHeading>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Child's name" style={{ ...fieldStyle, flex: 2 }} />
                    <input value={childAge} onChange={e => setChildAge(e.target.value)} inputMode="numeric" placeholder="Age" style={{ ...fieldStyle, flex: 1 }} />
                  </div>
                </>
              )}

              <SectionHeading>{mode === 'single' ? 'Select date' : 'Starting from'}</SectionHeading>
              <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4 }}>
                {dates.map((d, i) => {
                  const closed = !openWeekdays.has(new Date(`${d.iso}T00:00:00`).getDay());
                  return (
                  <div key={d.iso} onClick={() => { if (!closed) setDateIndex(i); }} style={{
                    minWidth: 56, flexShrink: 0, textAlign: 'center', padding: '11px 0', borderRadius: 13,
                    background: dateIndex === i ? 'var(--cl-accent)' : 'var(--cl-surface)',
                    border: `1px solid ${dateIndex === i ? 'var(--cl-accent)' : 'var(--cl-border)'}`,
                    cursor: closed ? 'default' : 'pointer',
                    opacity: closed ? 0.38 : 1,
                  }}>
                    <div style={{ fontSize: 10, color: dateIndex === i ? 'var(--cl-on-accent)' : 'var(--cl-muted-2)' }}>{d.day}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: dateIndex === i ? 'var(--cl-on-accent)' : 'var(--cl-ink)', marginTop: 3 }}>{d.date}</div>
                  </div>
                  );
                })}
              </div>

              {mode === 'package' && (
                <>
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

                  <SectionHeading>Which days each week?</SectionHeading>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {DAY_NAMES.map((label, dayIndex) => {
                      const closed = !openWeekdays.has(dayIndex);
                      return (
                        <ChoiceChip
                          key={label}
                          active={pkgDays.includes(dayIndex)}
                          onClick={closed ? undefined : () => togglePkgDay(dayIndex)}
                          style={{
                            flex: 1, textAlign: 'center', fontWeight: 700, padding: '10px 0',
                            border: '1px solid var(--cl-border)',
                            opacity: closed ? 0.38 : 1,
                          }}
                        >{label[0]}</ChoiceChip>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--cl-ink-fill)', borderRadius: 16, padding: 16, marginTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--cl-bfae97)' }}>{sessionCount} sessions total</div>
                      <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 22, color: 'var(--cl-on-ink)', marginTop: 3 }}>{formatNaira(totalPrice)}</div>
                    </div>
                    <StatusPill tone="accent" style={{ color: 'var(--cl-ink)', padding: '6px 11px' }}>Package rate</StatusPill>
                  </div>

                  {overCap && (
                    <p style={{ fontSize: 12.5, color: 'var(--cl-destructive)', margin: '10px 2px 0' }}>
                      That is {sessionCount} sessions — a request can cover at most {MAX_SESSIONS}. Pick fewer weeks or days.
                    </p>
                  )}
                </>
              )}

              <SectionHeading>Select time</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {availableTimes.map((slot) => (
                  <ChoiceChip
                    key={slot}
                    active={startTime === slot}
                    onClick={() => setStartTime(slot)}
                    style={startTime === slot ? { border: 'none' } : undefined}
                  >{slotLabel(slot)}</ChoiceChip>
                ))}
                {availableTimes.length === 0 && (
                  <p style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', margin: '2px 2px 0' }}>
                    {mode === 'package'
                      ? 'No single time suits every day you picked. Try fewer days.'
                      : 'This coach is not available on that day.'}
                  </p>
                )}
              </div>

              <SectionHeading>
                Note for the coach <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>(optional)</span>
              </SectionHeading>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Any goals or requirements?"
                maxLength={500}
                style={{ width: '100%', height: 74, borderRadius: 'var(--cl-radius-input)', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 13, padding: 13, marginTop: 14 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink-fill)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
                <span style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)' }}>
                  You&apos;ll only pay after {coachName(coach)} accepts.
                </span>
              </div>

              <div style={{ height: 90 }} />
            </>
          )}
        </QueryState>
      </PageBody>

      {coach && (
        <StickyFooter>
          <AppButton
            onClick={handleSubmit}
            disabled={submitDisabled}
            loading={createRequest.isPending}
            loadingLabel="Sending…"
          >
            {`Send request · ${formatNaira(totalPrice)}`}
          </AppButton>
        </StickyFooter>
      )}
    </AppPage>
  );
};

export default BookingRequestPage;
