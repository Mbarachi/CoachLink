import React, { useMemo, useState } from 'react';

import {
  AppButton, AppCard, AppPage, EmptyState, InitialsAvatar,
  PageBody, PageTitle, QueryState, StatusPill, TabChips,
} from '@/components/ui';
import { useBookings, useUpdateBooking } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf } from '@/lib/format';
import { useUiStore } from '@/store/ui.store';
import type { Booking } from '@/types';

const TABS = ['Today', 'Upcoming', 'To confirm', 'Past'] as const;
type Tab = (typeof TABS)[number];

const EMPTY: Record<Tab, { title: string; message: string }> = {
  Today: {
    title: 'Nothing on today',
    message: 'Sessions scheduled for today appear here, with who you are seeing and when.',
  },
  Upcoming: {
    title: 'Nothing coming up',
    message: 'Once an athlete books you, their sessions appear here.',
  },
  'To confirm': {
    title: 'Nothing to confirm',
    message: 'Sessions that have already happened wait here until you mark them done.',
  },
  Past: {
    title: 'Nothing past yet',
    message: 'Completed and cancelled sessions are kept here.',
  },
};

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const endOfToday = () => startOfToday() + 24 * 60 * 60 * 1000;

const CoachBookingsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const showToast = useUiStore((s) => s.showToast);
  const query = useBookings();

  /**
   * The service scopes by whoever is signed in — a coach gets their own
   * sessions — so this only has to decide which pile each one belongs in.
   *
   * "To confirm" is the one that earns its place: a paid session whose time has
   * passed is not history yet, because only the coach can say it happened. Left
   * in Past it would be buried, and nothing would ever reach COMPLETED.
   */
  const piles = useMemo<Record<Tab, Booking[]>>(() => {
    const all = query.data ?? [];
    const from = startOfToday();
    const to = endOfToday();
    const at = (b: Booking) => new Date(b.scheduledAt).getTime();
    const live = (b: Booking) => b.status === 'UPCOMING' || b.status === 'PENDING_PAYMENT';

    return {
      Today: all.filter((b) => live(b) && at(b) >= from && at(b) < to),
      Upcoming: all.filter((b) => live(b) && at(b) >= to),
      'To confirm': all.filter((b) => b.status === 'UPCOMING' && at(b) < from),
      Past: all.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED'),
    };
  }, [query.data]);

  const visible = piles[TABS[tab]];
  const labels = TABS.map((t) => (piles[t].length > 0 ? `${t} · ${piles[t].length}` : t));

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageTitle>My sessions</PageTitle>
        <TabChips tabs={labels} active={tab} onChange={setTab} />
      </div>

      <PageBody style={{ paddingTop: 16 }}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {visible.length === 0 ? (
            <EmptyState illustration="calendar" {...EMPTY[TABS[tab]]} />
          ) : (
            visible.map((booking) => (
              <SessionCard
                key={booking.id}
                booking={booking}
                confirmable={TABS[tab] === 'To confirm'}
                onDone={(message) => showToast(message)}
              />
            ))
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

interface SessionCardProps {
  booking: Booking;
  confirmable: boolean;
  onDone: (message: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ booking, confirmable, onDone }) => {
  const complete = useUpdateBooking(booking.id);
  const { athlete } = booking;

  const markComplete = async () => {
    try {
      await complete.mutateAsync({ status: 'COMPLETED' });
      onDone('Session marked as done.');
    } catch (err) {
      onDone(getErrorMessage(err));
    }
  };

  return (
    <AppCard padding={15} style={{ marginBottom: 13 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <InitialsAvatar
          initials={initialsOf(athlete.firstName, athlete.lastName)}
          src={athlete.profileImage}
          size={46} radius={13} fontSize={15}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>
            {fullName(athlete.firstName, athlete.lastName)}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
            {booking.sport.name}
            {/* A parent booked this for a child, so the coach knows who turns up. */}
            {athlete.bookedForChild && ' · for their child'}
          </div>
        </div>
        <StatusPill status={booking.status} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 13, fontSize: 12.5, color: 'var(--cl-muted-3)' }}>
        <span>📅 {formatSessionDate(booking.scheduledAt)}</span>
        <span>🕗 {formatSessionTime(booking.scheduledAt)}</span>
        <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--cl-ink)' }}>
          {formatNaira(booking.sessionRate)}
        </span>
      </div>

      {/* Unpaid means accepted but not yet confirmed — worth saying plainly, so
          nobody travels to a session the athlete has not paid for. */}
      {booking.status === 'PENDING_PAYMENT' && (
        <div style={{ fontSize: 12, color: 'var(--cl-pending-text)', marginTop: 8 }}>
          Not confirmed until the athlete pays.
        </div>
      )}

      {confirmable && (
        <AppButton
          onClick={() => void markComplete()}
          loading={complete.isPending}
          loadingLabel="Saving…"
          style={{ marginTop: 13, width: '100%' }}
        >
          Mark as done
        </AppButton>
      )}
    </AppCard>
  );
};

export default CoachBookingsPage;
