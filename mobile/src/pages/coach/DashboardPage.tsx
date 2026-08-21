import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, EmptyState, InitialsAvatar, PageBody, QueryState, StatusBar, StatusPill } from '@/components/ui';
import { useBookingRequests, useCoaches } from '@/hooks';
import { formatSessionDate, formatSessionTime, fullName, initialsOf } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';

const StatCard: React.FC<{ val: string; label: string; dark?: boolean }> = ({ val, label, dark }) => (
  <div style={{ flex: 1, background: dark ? 'var(--cl-ink)' : 'var(--cl-surface)', border: dark ? 'none' : '1px solid var(--cl-border)', borderRadius: 18, padding: 16 }}>
    <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: dark ? 26 : 21, color: dark ? 'var(--cl-accent)' : 'var(--cl-ink)' }}>{val}</div>
    <div style={{ fontSize: 11.5, color: dark ? 'var(--cl-bfae97)' : 'var(--cl-muted-1)', marginTop: 3 }}>{label}</div>
  </div>
);

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.firstName ?? '';
  const initials = initialsOf(user?.firstName, user?.lastName);

  const requestsQuery = useBookingRequests();
  const requests = useMemo(() => requestsQuery.data ?? [], [requestsQuery.data]);
  const pending = useMemo(() => requests.filter(r => r.status === 'PENDING'), [requests]);
  const accepted = useMemo(() => requests.filter(r => r.status === 'ACCEPTED'), [requests]);

  // Sessions the coach has committed to that are still ahead of them.
  const upcomingSessions = useMemo(() => {
    const now = Date.now();
    return accepted.reduce(
      (total, r) => total + r.sessions.filter(s => new Date(s.scheduledAt).getTime() > now).length,
      0,
    );
  }, [accepted]);

  // Rating lives on the coach's own profile; find it by the signed-in user id.
  const coaches = useCoaches();
  const myProfile = coaches.data?.find(c => c.profile.userId === user?.id)?.profile;

  return (
    <AppPage padding="screen">
      <PageBody pb={96}>
        <StatusBar />

        {/* greeting */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Good morning,</div>
            <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 25, letterSpacing: '-0.03em', color: 'var(--cl-ink)', marginTop: 1 }}>Coach {firstName}</div>
          </div>
          <InitialsAvatar initials={initials} size={48} radius={15} fontSize={16} />
        </div>

        {/* stat cards */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <StatCard val={String(pending.length)} label="New requests" dark />
          <StatCard val={String(upcomingSessions)} label="Upcoming sessions" />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          {/* Earnings need the Payments module, which isn't built yet. */}
          <StatCard val="₦0" label="Earned this month" />
          <StatCard
            val={myProfile && myProfile.totalReviews > 0 ? `${myProfile.rating.toFixed(1)} ★` : '—'}
            label={
              myProfile && myProfile.totalReviews > 0
                ? `Rating · ${myProfile.totalReviews} reviews`
                : 'No reviews yet'
            }
          />
        </div>

        {/* pending requests */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '24px 0 11px' }}>
          <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 16, color: 'var(--cl-ink)' }}>Pending requests</span>
          <span onClick={() => history.push('/coach/requests')} style={{ fontSize: 12.5, color: 'var(--cl-ink)', fontWeight: 600, cursor: 'pointer' }}>View all</span>
        </div>

        <QueryState isLoading={requestsQuery.isPending} error={requestsQuery.error} onRetry={() => void requestsQuery.refetch()}>
          {pending.length === 0 ? (
            <AppCard padding={4} style={{ borderRadius: 16 }}>
              <EmptyState
                compact
                illustration="requests"
                title="No pending requests"
                message="New session requests from athletes land here."
              />
            </AppCard>
          ) : (
            pending.slice(0, 3).map(rq => {
              const first = rq.sessions[0];
              return (
                <AppCard
                  key={rq.id}
                  onClick={() => history.push(`/coach/requests/${rq.id}`)}
                  padding={13}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16, marginBottom: 10 }}
                >
                  <InitialsAvatar
                    initials={initialsOf(rq.athlete.firstName, rq.athlete.lastName)}
                    size={44} tone="subtle" radius={12} fontSize={14}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>
                      {fullName(rq.athlete.firstName, rq.athlete.lastName)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cl-muted-1)' }}>
                      {first ? `${formatSessionDate(first.scheduledAt)} · ${formatSessionTime(first.scheduledAt)}` : rq.startTime}
                    </div>
                  </div>
                  <StatusPill status="New" />
                </AppCard>
              );
            })
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default DashboardPage;
