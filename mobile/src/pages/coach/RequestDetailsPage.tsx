import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton,
  AppCard,
  AppPage,
  DetailRow,
  InitialsAvatar,
  PageBody,
  PageHeader,
  QueryState,
  SectionHeading,
  StatusPill,
  StickyFooter,
} from '@/components/ui';
import { useBookingRequest, useRespondToBookingRequest } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import {
  describeSchedule, formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf,
} from '@/lib/format';
import { useUiStore } from '@/store/ui.store';

const RequestDetailsPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const showToast = useUiStore((s) => s.showToast);

  const query = useBookingRequest(id);
  const respond = useRespondToBookingRequest(id);
  const req = query.data;

  const decide = async (status: 'ACCEPTED' | 'DECLINED') => {
    try {
      await respond.mutateAsync({ status });
      showToast(status === 'ACCEPTED' ? 'Request accepted.' : 'Request declined.', 'success');
      history.goBack();
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not update this request.'), 'danger');
    }
  };

  const first = req?.sessions[0];
  const canRespond = req?.status === 'PENDING';

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Request details" />
      </div>

      <PageBody>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {!req ? null : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <InitialsAvatar
                  initials={initialsOf(req.athlete.firstName, req.athlete.lastName)}
                  size={56} tone="subtle" radius={16} fontSize={18}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cl-ink)' }}>
                    {fullName(req.athlete.firstName, req.athlete.lastName)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Requested a {req.sport.name} session</div>
                </div>
                <StatusPill status={req.status} />
              </div>

              {req.childName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cl-accent)', borderRadius: 14, padding: 13, marginTop: 16 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--cl-ink-fill)', flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: 'var(--cl-ink)' }}>
                    <strong>Booking for a child:</strong> {req.childName}
                    {req.childAge !== null && `, age ${req.childAge}`}
                  </div>
                </div>
              )}

              <AppCard padding="4px 16px" style={{ borderRadius: 16, marginTop: 16 }}>
                <DetailRow
                  label={req.mode === 'PACKAGE' ? 'Starts' : 'Date'}
                  value={first ? formatSessionDate(first.scheduledAt) : '—'}
                />
                <DetailRow label="Time" value={first ? formatSessionTime(first.scheduledAt) : req.startTime} />
                {req.mode === 'PACKAGE' && (
                  <DetailRow label="Schedule" value={describeSchedule(req.daysOfWeek, req.weeks)} />
                )}
                <DetailRow label="Sessions" value={String(req.sessionCount)} />
                <DetailRow label="Venue" value={req.coach.venue} />
                <DetailRow
                  label={req.sessionCount > 1 ? 'Total fee' : 'Session fee'}
                  value={formatNaira(req.totalAmount)}
                  last
                />
              </AppCard>

              {req.sessionCount > 1 && (
                <>
                  <SectionHeading style={{ margin: '18px 0 8px' }}>All sessions</SectionHeading>
                  <AppCard padding="4px 16px" style={{ borderRadius: 14 }}>
                    {req.sessions.map((s, i) => (
                      <DetailRow
                        key={s.id}
                        label={`Session ${i + 1}`}
                        value={`${formatSessionDate(s.scheduledAt)} · ${formatSessionTime(s.scheduledAt)}`}
                        last={i === req.sessions.length - 1}
                      />
                    ))}
                  </AppCard>
                </>
              )}

              <SectionHeading style={{ margin: '18px 0 8px' }}>Note from athlete</SectionHeading>
              <AppCard padding={14} style={{ borderRadius: 14, fontSize: 13.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>
                {req.notes || 'No note was left with this request.'}
              </AppCard>

              <div style={{ height: 96 }} />
            </>
          )}
        </QueryState>
      </PageBody>

      {canRespond && (
        <StickyFooter style={{ display: 'flex', gap: 10, paddingLeft: 0, paddingRight: 0 }}>
          {/* Destructive, matching the athlete's cancel action — turning someone
              down is the same weight of decision and should read the same. */}
          <AppButton
            variant="destructive" size="md" fullWidth={false}
            disabled={respond.isPending}
            onClick={() => void decide('DECLINED')}
            style={{ flex: 1, fontSize: 15, border: '1.6px solid var(--cl-destructive-line)' }}
          >
            Decline
          </AppButton>
          <AppButton
            size="md" fullWidth={false}
            loading={respond.isPending}
            loadingLabel="Saving…"
            onClick={() => void decide('ACCEPTED')}
            style={{ flex: 2, fontSize: 15 }}
          >
            Accept request
          </AppButton>
        </StickyFooter>
      )}
    </AppPage>
  );
};

export default RequestDetailsPage;
