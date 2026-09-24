import React, { useEffect, useState } from 'react';

import {
  AppButton, AppCard, AppPage, ChoiceChip, LoadingOverlay, PageBody,
  PageTitle, QueryState, StickyFooter, Toggle,
} from '@/components/ui';
import { useMyCoachProfile, useUpdateCoachProfile } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { DAY_LABELS, SLOTS, describeDay, slotLabel } from '@/lib/slots';
import type { Availability } from '@/types';
import { useUiStore } from '@/store/ui.store';

/** Turning a day on with nothing chosen would be a lie, so it opens at 8. */
const DEFAULT_SLOT = '08:00';

const emptyWeek = (): Availability =>
  Object.fromEntries(DAY_LABELS.map((_, day) => [String(day), []]));

/**
 * A weekly pattern, not a calendar. A coach sets "Mondays at 6 and 7" once and
 * it holds until they change it — maintaining real dates forever is work no
 * one does, and a stale calendar is worse than none.
 */
const AvailabilityPage: React.FC = () => {
  const showToast = useUiStore((s) => s.showToast);
  const query = useMyCoachProfile();
  const coach = query.data;
  const save = useUpdateCoachProfile(coach?.profile.id);

  const [week, setWeek] = useState<Availability>(emptyWeek);
  const [openDay, setOpenDay] = useState(1); // Monday reads as the start of a week

  // Seeded once the profile arrives; edits after that are the user's.
  useEffect(() => {
    if (!coach) return;
    setWeek({ ...emptyWeek(), ...coach.profile.availability });
  }, [coach]);

  const timesFor = (day: number) => week[String(day)] ?? [];

  const toggleDay = (day: number) => {
    setWeek((prev) => {
      const current = prev[String(day)] ?? [];
      return { ...prev, [String(day)]: current.length > 0 ? [] : [DEFAULT_SLOT] };
    });
    setOpenDay(day);
  };

  const toggleSlot = (day: number, slot: string) => {
    setWeek((prev) => {
      const current = prev[String(day)] ?? [];
      const next = current.includes(slot)
        ? current.filter((t) => t !== slot)
        : [...current, slot].sort();
      return { ...prev, [String(day)]: next };
    });
  };

  const submit = async () => {
    try {
      await save.mutateAsync({ availability: week });
      showToast('Availability saved.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not save your availability.'), 'danger');
    }
  };

  const totalSlots = Object.values(week).reduce((n, times) => n + times.length, 0);

  return (
    <AppPage padding="screen">
      <LoadingOverlay show={save.isPending} label="Saving availability…" />

      <div style={{ flexShrink: 0 }}>
        <PageTitle style={{ marginBottom: 4 }}>Availability</PageTitle>
        <p style={{ fontSize: 13, color: 'var(--cl-muted-1)', margin: '0 0 12px' }}>
          The days and times you are open to coach. Athletes can only request
          these.
        </p>
      </div>

      <PageBody refreshable pb={96}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          <AppCard padding={0} style={{ borderRadius: 16, overflow: 'hidden' }}>
            {DAY_LABELS.map((label, day) => {
              const times = timesFor(day);
              const on = times.length > 0;
              return (
                <div
                  key={label}
                  onClick={() => setOpenDay(day)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 15px',
                    borderBottom: day === 6 ? 'none' : '1px solid var(--cl-subtle)',
                    cursor: 'pointer',
                    // The day being edited below is named, not just implied.
                    background: openDay === day ? 'var(--cl-subtle)' : 'transparent',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: on ? 'var(--cl-ink)' : 'var(--cl-muted-2)' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cl-muted-1)', marginTop: 2 }}>
                      {describeDay(times) ?? 'Closed'}
                    </div>
                  </div>
                  <Toggle on={on} onChange={() => toggleDay(day)} />
                </div>
              );
            })}
          </AppCard>

          <h4 style={{
            fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14,
            color: 'var(--cl-ink)', margin: '20px 0 10px',
          }}>
            {DAY_LABELS[openDay]} times
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SLOTS.map((slot) => (
              <ChoiceChip
                key={slot}
                active={timesFor(openDay).includes(slot)}
                onClick={() => toggleSlot(openDay, slot)}
              >
                {slotLabel(slot)}
              </ChoiceChip>
            ))}
          </div>

          <p style={{ fontSize: 11.5, lineHeight: 1.45, color: 'var(--cl-muted-2)', margin: '14px 2px 0' }}>
            {totalSlots === 0
              ? 'With nothing set, athletes can ask for any time — so a request may arrive for an hour that does not suit you.'
              : 'Already-accepted sessions are unaffected by a change here.'}
          </p>
        </QueryState>
      </PageBody>

      <StickyFooter>
        <AppButton
          onClick={() => void submit()}
          loading={save.isPending}
          loadingLabel="Saving…"
          style={{ width: '100%' }}
        >
          Save availability
        </AppButton>
      </StickyFooter>
    </AppPage>
  );
};

export default AvailabilityPage;
