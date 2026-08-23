import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppCard,
  AppPage,
  EmptyState,
  InitialsAvatar,
  PageBody,
  PageTitle,
  QueryState,
  StatusPill,
  TabChips,
} from '@/components/ui';
import { useBookingRequests } from '@/hooks';
import { formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf } from '@/lib/format';
import type { BookingRequest, BookingRequestStatus } from '@/types';

const TABS = ['Upcoming', 'Pending', 'Closed'] as const;

/**
 * There is no Bookings module yet, so an athlete's requests are the closest
 * truthful stand-in: accepted ones are what's coming up, and declined,
 * cancelled or expired ones are closed.
 */
const TAB_STATUSES: Record<(typeof TABS)[number], BookingRequestStatus[]> = {
  Upcoming: ['ACCEPTED'],
  Pending: ['PENDING'],
  Closed: ['DECLINED', 'CANCELLED', 'EXPIRED'],
};

const EMPTY_COPY: Record<(typeof TABS)[number], { title: string; message: string }> = {
  Upcoming: {
    title: 'Nothing coming up',
    message: 'Once a coach accepts one of your requests, the session shows up here.',
  },
  Pending: {
    title: 'No pending requests',
    message: 'Find a coach and request a session to get started.',
  },
  Closed: {
    title: 'Nothing closed yet',
    message: 'Declined, cancelled and expired requests are kept here.',
  },
};

const MyBookingsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState(0);

  // One unfiltered read backs all three tabs, so switching costs no request.
  const query = useBookingRequests();
  const requests = query.data ?? [];

  const visible = useMemo<BookingRequest[]>(
    () => requests.filter(r => TAB_STATUSES[TABS[tab]].includes(r.status)),
    [requests, tab],
  );

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageTitle>My bookings</PageTitle>
        <TabChips tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <PageBody style={{ paddingTop: 16 }}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {visible.length === 0 ? (
            <EmptyState illustration="bookings" {...EMPTY_COPY[TABS[tab]]} />
          ) : (
            visible.map(rq => {
              const first = rq.sessions[0];
              return (
                <AppCard
                  key={rq.id}
                  onClick={() => history.push(`/athlete/bookings/${rq.id}`)}
                  padding={15}
                  style={{ marginBottom: 13 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <InitialsAvatar
                      initials={initialsOf(rq.coach.firstName, rq.coach.lastName)}
                      size={46} radius={13} fontSize={15}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>
                        {fullName(rq.coach.firstName, rq.coach.lastName)}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
                        {rq.sport.name} · {rq.coach.venue}
                      </div>
                    </div>
                    <StatusPill status={rq.status} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 13, fontSize: 12.5, color: 'var(--cl-muted-3)' }}>
                    {first && <span>📅 {formatSessionDate(first.scheduledAt)}</span>}
                    {first && <span>🕗 {formatSessionTime(first.scheduledAt)}</span>}
                    <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--cl-ink)' }}>
                      {formatNaira(rq.totalAmount)}
                    </span>
                  </div>
                  {rq.sessionCount > 1 && (
                    <div style={{ fontSize: 12, color: 'var(--cl-muted-2)', marginTop: 6 }}>
                      {rq.sessionCount}-session package
                    </div>
                  )}
                </AppCard>
              );
            })
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default MyBookingsPage;
