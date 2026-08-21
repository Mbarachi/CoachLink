import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppCard, AppPage, EmptyState, InitialsAvatar,
  PageBody, PageTitle, QueryState, StatusBar, TabChips,
} from '@/components/ui';
import { useBookingRequests } from '@/hooks';
import { formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf } from '@/lib/format';
import type { BookingRequestStatus } from '@/types';

const TAB_STATUS: BookingRequestStatus[] = ['PENDING', 'ACCEPTED', 'DECLINED'];

const IncomingRequestsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState(0);

  const query = useBookingRequests({ status: TAB_STATUS[tab] });
  const requests = query.data ?? [];

  // The count only means anything on the queue the coach has to act on.
  const pending = useBookingRequests({ status: 'PENDING' });
  const pendingCount = pending.data?.length ?? 0;
  const tabs = [pendingCount > 0 ? `New · ${pendingCount}` : 'New', 'Accepted', 'Declined'];

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageTitle>Requests</PageTitle>
        <TabChips tabs={tabs} active={tab} onChange={setTab} />
      </div>

      <PageBody style={{ paddingTop: 16 }}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {requests.length === 0 ? (
            <EmptyState
              illustration="requests"
              title={tab === 0 ? 'No new requests' : `Nothing ${TAB_STATUS[tab].toLowerCase()}`}
              message={
                tab === 0
                  ? 'When an athlete requests a session with you, it lands here.'
                  : undefined
              }
            />
          ) : (
            requests.map(rq => {
              const first = rq.sessions[0];
              return (
                <AppCard
                  key={rq.id}
                  onClick={() => history.push(`/coach/requests/${rq.id}`)}
                  padding={15}
                  style={{ marginBottom: 12 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <InitialsAvatar
                      initials={initialsOf(rq.athlete.firstName, rq.athlete.lastName)}
                      size={46}
                      tone="subtle"
                      radius={13}
                      fontSize={15}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>
                        {fullName(rq.athlete.firstName, rq.athlete.lastName)}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
                        {rq.sport.name}
                        {first && ` · ${formatSessionDate(first.scheduledAt)} · ${formatSessionTime(first.scheduledAt)}`}
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{formatNaira(rq.totalAmount)}</span>
                  </div>
                  {rq.sessionCount > 1 && (
                    <div style={{ fontSize: 12, color: 'var(--cl-muted-2)', marginTop: 8 }}>
                      {rq.sessionCount}-session package
                    </div>
                  )}
                  {rq.notes && (
                    <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)', margin: '11px 0 0' }}>{rq.notes}</p>
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

export default IncomingRequestsPage;
