import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, DetailRow, InitialsAvatar,
  PageBody, PageHeader, QueryState, SectionHeading, StatusPill,
} from '@/components/ui';
import { useBookingRequest, useRespondToBookingRequest } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import {
  describeSchedule, formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf,
} from '@/lib/format';
import { useUiStore } from '@/store/ui.store';

/**
 * The athlete's view of a request they have sent, before it becomes bookings.
 * Without this the only evidence a request existed was a counter on the home
 * screen — the success screen said it had been sent, and then it vanished.
 */
const BANNERS: Partial<Record<string, string>> = {
  PENDING: 'Sent. We’ll let you know as soon as your coach responds.',
  ACCEPTED: 'Accepted — your sessions are under “To pay”.',
  DECLINED: 'Your coach could not take this one. Try another date, or another coach.',
  EXPIRED: 'The dates you proposed passed before your coach responded.',
  CANCELLED: 'You withdrew this request.',
};

const RequestDetailsPage: React.FC = () => {
  const history = useHistory();
  const { requestId } = useParams<{ requestId: string }>();
  const showToast = useUiStore((s) => s.showToast);

  const query = useBookingRequest(requestId);
  const respond = useRespondToBookingRequest(requestId);
  const req = query.data;

  const withdraw = async () => {
    try {
      await respond.mutateAsync({ status: 'CANCELLED' });
      showToast('Request withdrawn.', 'success');
      history.replace('/athlete/bookings');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not withdraw this request.'), 'danger');
    }
  };

  const first = req?.sessions[0];

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Request details" onBack={() => history.push('/athlete/bookings')} />
      </div>

      <PageBody>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {!req ? null : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <InitialsAvatar
                  initials={initialsOf(req.coach.firstName, req.coach.lastName)}
                  src={req.coach.profileImage}
                  size={54} radius={15} fontSize={17}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)' }}>
                    {fullName(req.coach.firstName, req.coach.lastName)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>
                    {req.sport.name} · {req.coach.venue}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <StatusPill tone="neutral" style={{ color: 'var(--cl-ink)' }}>
                  {req.mode === 'PACKAGE' ? 'Weekly package' : 'Single session'}
                </StatusPill>
                <StatusPill status={req.status} />
              </div>

              {BANNERS[req.status] && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 14, padding: 14, marginTop: 16 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>{BANNERS[req.status]}</span>
                </div>
              )}

              <AppCard padding="4px 16px" style={{ borderRadius: 16, marginTop: 16 }}>
                {req.mode === 'PACKAGE' && (
                  <DetailRow label="Schedule" value={describeSchedule(req.daysOfWeek, req.weeks)} />
                )}
                <DetailRow
                  label={req.mode === 'PACKAGE' ? 'Starts' : 'Date'}
                  value={first ? formatSessionDate(first.scheduledAt) : '—'}
                />
                <DetailRow label="Time" value={first ? formatSessionTime(first.scheduledAt) : req.startTime} />
                {req.sessionCount > 1 && <DetailRow label="Sessions" value={String(req.sessionCount)} />}
                <DetailRow label="Per session" value={formatNaira(req.sessionRate)} />
                <DetailRow
                  label={req.sessionCount > 1 ? 'Total' : 'Session fee'}
                  value={formatNaira(req.totalAmount)}
                  bold last
                />
              </AppCard>

              {req.notes && (
                <>
                  <SectionHeading style={{ margin: '18px 0 8px' }}>Your note</SectionHeading>
                  <AppCard padding={14} style={{ borderRadius: 14, fontSize: 13.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>
                    {req.notes}
                  </AppCard>
                </>
              )}

              {req.status === 'PENDING' && (
                <AppButton
                  variant="destructive"
                  size="md"
                  loading={respond.isPending}
                  loadingLabel="Withdrawing…"
                  onClick={() => void withdraw()}
                  style={{ height: 52, fontSize: 15, marginTop: 18, border: '1.6px solid #f0c9bb' }}
                >
                  Withdraw request
                </AppButton>
              )}

              <div style={{ height: 40 }} />
            </>
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default RequestDetailsPage;
