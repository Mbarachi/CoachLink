import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppCard, AppPage, EmptyState, InitialsAvatar,
  PageBody, PageTitle, QueryState, StatusPill, TabChips,
} from '@/components/ui';
import { useBookings } from '@/hooks';
import { formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf } from '@/lib/format';
import type { Booking, BookingStatus } from '@/types';

const TABS = ['Upcoming', 'Awaiting payment', 'Past'] as const;

const TAB_STATUSES: Record<(typeof TABS)[number], BookingStatus[]> = {
  Upcoming: ['UPCOMING'],
  'Awaiting payment': ['PENDING_PAYMENT'],
  Past: ['COMPLETED', 'CANCELLED'],
};

const EMPTY_COPY: Record<(typeof TABS)[number], { title: string; message: string }> = {
  Upcoming: {
    title: 'Nothing coming up',
    message: 'Sessions appear here once they are paid for and confirmed.',
  },
  'Awaiting payment': {
    title: 'Nothing awaiting payment',
    message: 'When a coach accepts your request, the sessions land here to be paid for.',
  },
  Past: {
    title: 'Nothing past yet',
    message: 'Completed and cancelled sessions are kept here.',
  },
};

const MyBookingsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState(0);

  // One unfiltered read backs all three tabs, so switching costs no request.
  const query = useBookings();
  const bookings = query.data ?? [];

  const visible = useMemo<Booking[]>(
    () => bookings.filter((b) => TAB_STATUSES[TABS[tab]].includes(b.status)),
    [bookings, tab],
  );

  const awaiting = bookings.filter((b) => b.status === 'PENDING_PAYMENT').length;
  const tabs = TABS.map((t, i) =>
    i === 1 && awaiting > 0 ? `${t} · ${awaiting}` : t,
  );

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageTitle>My bookings</PageTitle>
        <TabChips tabs={tabs} active={tab} onChange={setTab} />
      </div>

      <PageBody style={{ paddingTop: 16 }}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {visible.length === 0 ? (
            <EmptyState illustration="bookings" {...EMPTY_COPY[TABS[tab]]} />
          ) : (
            visible.map((b) => (
              <AppCard
                key={b.id}
                onClick={() => history.push(`/athlete/bookings/${b.id}`)}
                padding={15}
                style={{ marginBottom: 13 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <InitialsAvatar
                    initials={initialsOf(b.coach.firstName, b.coach.lastName)}
                    size={46} radius={13} fontSize={15}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>
                      {fullName(b.coach.firstName, b.coach.lastName)}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
                      {b.sport.name} · {b.coach.venue}
                    </div>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 13, fontSize: 12.5, color: 'var(--cl-muted-3)' }}>
                  <span>📅 {formatSessionDate(b.scheduledAt)}</span>
                  <span>🕗 {formatSessionTime(b.scheduledAt)}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--cl-ink)' }}>
                    {formatNaira(b.sessionRate)}
                  </span>
                </div>
              </AppCard>
            ))
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default MyBookingsPage;
