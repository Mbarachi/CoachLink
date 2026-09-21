import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, EmptyState, InitialsAvatar, PageBody, QueryState, StatusPill, VerifyEmailBanner } from '@/components/ui';
import { useBookingRequests, useMyCoachProfile } from '@/hooks';
import { formatSessionDate, formatSessionTime, fullName, initialsOf, timeOfDayGreeting } from '@/lib/format';
import VerificationCard from '@/components/coach/VerificationCard';
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

  // Their own profile whatever its status. The public list is approved-only,
  // so reading it from there left the coaches who most need their status —
  // pending and rejected — unable to find themselves at all.
  const mine = useMyCoachProfile();
  const myProfile = mine.data?.profile;

  return (
    <AppPage padding="screen">
      <PageBody pb={96}>
        <VerifyEmailBanner />
        {/* greeting */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>{timeOfDayGreeting()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 1 }}>
              <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 25, letterSpacing: '-0.03em', color: 'var(--cl-ink)' }}>{firstName}</span>
              {/* Carries what the greeting used to say by prefixing "Coach", so
                  the two do not repeat each other. */}
              <StatusPill tone="accent" style={{ fontSize: 10.5, letterSpacing: '.02em', padding: '3px 9px' }}>Coach</StatusPill>
            </div>
          </div>
          <InitialsAvatar initials={initials} size={48} radius={15} fontSize={16} />
        </div>

        <VerificationCard coach={mine.data} onFix={() => history.push('/coach/resubmit')} />

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
