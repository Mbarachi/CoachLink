import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppCard, AppPage, EmptyState, InitialsAvatar,
  PageBody, PageTitle, QueryState, StatusPill, TabChips,
} from '@/components/ui';
import { useBookingRequests, useBookings, useMyReviewedBookings } from '@/hooks';
import { formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf } from '@/lib/format';
import { isAhead, newestFirst, shownStatus } from '@/lib/sessions';

const TABS = ['Pending', 'To pay', 'Upcoming', 'Past'] as const;
type Tab = (typeof TABS)[number];

/**
 * A row here is either a booking or — before a coach has answered — the
 * request that will become one. Requests have no booking yet, so without this
 * a just-submitted session was invisible everywhere except a counter on the
 * home screen, while the success screen promised it had been sent.
 */
interface Row {
  id: string;
  href: string;
  coach: { firstName: string; lastName: string; profileImage: string | null; venue: string };
  sportName: string;
  scheduledAt: string | null;
  amount: number;
  status: string;
  sessions: number;
  note?: string;
}

const EMPTY: Record<Tab, { title: string; message: string }> = {
  Pending: {
    title: 'No requests waiting',
    message: 'Requests you have sent appear here until a coach responds.',
  },
  'To pay': {
    title: 'Nothing to pay for',
    message: 'When a coach accepts, the sessions land here to be paid for.',
  },
  Upcoming: {
    title: 'Nothing coming up',
    message: 'Paid sessions appear here with the date and venue.',
  },
  Past: {
    title: 'Nothing past yet',
    message: 'Sessions whose time has passed are kept here.',
  },
};

const MyBookingsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState(0);

  const bookingsQuery = useBookings();
  const requestsQuery = useBookingRequests();
  const reviewed = useMyReviewedBookings();
  const bookings = useMemo(() => bookingsQuery.data ?? [], [bookingsQuery.data]);
  const requests = useMemo(() => requestsQuery.data ?? [], [requestsQuery.data]);
  const reviewedIds = useMemo(() => reviewed.data ?? [], [reviewed.data]);

  const rows = useMemo<Record<Tab, Row[]>>(() => {
    const fromBooking = (b: (typeof bookings)[number]): Row => {
      const shown = shownStatus(b);
      return {
        id: b.id,
        href: `/athlete/bookings/${b.id}`,
        coach: b.coach,
        sportName: b.sport.name,
        scheduledAt: b.scheduledAt,
        amount: b.sessionRate,
        status: shown,
        sessions: 1,
        // A review nobody is asked for is a review nobody writes, and Past is
        // the only screen an athlete revisits after a session.
        note: shown === 'COMPLETED' && !reviewedIds.includes(b.id)
          ? `Tap to review ${b.coach.firstName}`
          : shown === 'AWAITING_CONFIRMATION'
            ? `Waiting for ${b.coach.firstName} to confirm it took place`
            : shown === 'NOT_PAID'
              ? 'Not paid for before it started, so it did not go ahead'
              : undefined,
      };
    };

    const fromRequest = (r: (typeof requests)[number]): Row => ({
      id: r.id,
      // Requests keep their own detail screen; they are not bookings yet.
      href: `/athlete/requests/${r.id}`,
      coach: r.coach,
      sportName: r.sport.name,
      scheduledAt: r.sessions[0]?.scheduledAt ?? null,
      amount: r.totalAmount,
      status: r.status,
      sessions: r.sessionCount,
      note: r.status === 'PENDING'
        ? `Waiting for ${r.coach.firstName} to respond`
        : undefined,
    });

    return {
      Pending: requests.filter((r) => r.status === 'PENDING').map(fromRequest),
      // Only sessions still ahead: once one's hour is over it is no longer
      // "upcoming" or payable, whatever the stored status says.
      'To pay': bookings.filter((b) => b.status === 'PENDING_PAYMENT' && isAhead(b)).map(fromBooking),
      Upcoming: bookings.filter((b) => b.status === 'UPCOMING' && isAhead(b)).map(fromBooking),
      // Requests a coach turned down, or that lapsed, belong here too —
      // otherwise they vanish with no explanation.
      Past: [
        ...bookings.filter((b) => !isAhead(b)).map(fromBooking),
        ...requests.filter((r) => ['DECLINED', 'EXPIRED', 'CANCELLED'].includes(r.status)).map(fromRequest),
      ].sort(newestFirst),
    };
  }, [bookings, requests, reviewedIds]);

  const visible = rows[TABS[tab]];
  const labels = TABS.map((t) => (rows[t].length > 0 ? `${t} · ${rows[t].length}` : t));

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageTitle>My bookings</PageTitle>
        <TabChips tabs={labels} active={tab} onChange={setTab} />
      </div>

      <PageBody refreshable style={{ paddingTop: 16 }}>
        <QueryState
          isLoading={bookingsQuery.isPending || requestsQuery.isPending}
          error={bookingsQuery.error ?? requestsQuery.error}
          onRetry={() => { void bookingsQuery.refetch(); void requestsQuery.refetch(); }}
        >
          {visible.length === 0 ? (
            <EmptyState illustration="bookings" {...EMPTY[TABS[tab]]} />
          ) : (
            visible.map((row) => (
              <AppCard
                key={row.id}
                onClick={() => history.push(row.href)}
                padding={15}
                style={{ marginBottom: 13 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <InitialsAvatar
                    initials={initialsOf(row.coach.firstName, row.coach.lastName)}
                    src={row.coach.profileImage}
                    size={46} radius={13} fontSize={15}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>
                      {fullName(row.coach.firstName, row.coach.lastName)}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
                      {row.sportName} · {row.coach.venue}
                    </div>
                  </div>
                  <StatusPill status={row.status} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 13, fontSize: 12.5, color: 'var(--cl-muted-3)' }}>
                  {row.scheduledAt && <span>📅 {formatSessionDate(row.scheduledAt)}</span>}
                  {row.scheduledAt && <span>🕗 {formatSessionTime(row.scheduledAt)}</span>}
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--cl-ink)' }}>
                    {formatNaira(row.amount)}
                  </span>
                </div>

                {row.sessions > 1 && (
                  <div style={{ fontSize: 12, color: 'var(--cl-muted-2)', marginTop: 6 }}>
                    {row.sessions}-session package
                  </div>
                )}
                {row.note && (
                  <div style={{ fontSize: 12, color: 'var(--cl-muted-2)', marginTop: 6 }}>{row.note}</div>
                )}
              </AppCard>
            ))
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default MyBookingsPage;
