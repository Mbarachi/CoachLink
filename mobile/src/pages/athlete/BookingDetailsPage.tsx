import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, DetailRow, InitialsAvatar,
  PageBody, PageHeader, QueryState, StatusPill,
} from '@/components/ui';
import { useBooking, useUpdateBooking } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import {
  formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf,
} from '@/lib/format';
import { useUiStore } from '@/store/ui.store';

const BANNERS: Partial<Record<string, string>> = {
  PENDING_PAYMENT: 'Your coach accepted. Pay to confirm this session — payments go live shortly.',
  UPCOMING: 'Confirmed. Your coach is expecting you.',
  COMPLETED: 'This session is done. Reviews open once that module is live.',
  CANCELLED: 'This session was cancelled.',
};

const BookingDetailsPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const showToast = useUiStore((s) => s.showToast);

  const query = useBooking(bookingId);
  const update = useUpdateBooking(bookingId);
  const booking = query.data;

  const cancel = async () => {
    try {
      await update.mutateAsync({ status: 'CANCELLED' });
      showToast('Session cancelled.', 'success');
      history.push('/athlete/bookings');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not cancel this session.'), 'danger');
    }
  };

  const canCancel = booking?.status === 'PENDING_PAYMENT' || booking?.status === 'UPCOMING';

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Session details" onBack={() => history.push('/athlete/bookings')} />
      </div>

      <PageBody>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {!booking ? null : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <InitialsAvatar
                  initials={initialsOf(booking.coach.firstName, booking.coach.lastName)}
                  size={54} radius={15} fontSize={17}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)' }}>
                    {fullName(booking.coach.firstName, booking.coach.lastName)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>
                    {booking.sport.name} · {booking.coach.venue}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <StatusPill status={booking.status} />
              </div>

              {BANNERS[booking.status] && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 14, padding: 14, marginTop: 16 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink-fill)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>{BANNERS[booking.status]}</span>
                </div>
              )}

              <AppCard padding="4px 16px" style={{ borderRadius: 16, marginTop: 16 }}>
                <DetailRow label="Date" value={formatSessionDate(booking.scheduledAt)} />
                <DetailRow label="Time" value={formatSessionTime(booking.scheduledAt)} />
                <DetailRow label="Venue" value={booking.coach.venue} />
                <DetailRow label="Session fee" value={formatNaira(booking.sessionRate)} bold last />
              </AppCard>

              {booking.status === 'PENDING_PAYMENT' && (
                <AppButton
                  size="md"
                  onClick={() => history.push(`/athlete/payment/${booking.id}`)}
                  style={{ height: 52, fontSize: 15, marginTop: 18 }}
                >
                  Pay {formatNaira(booking.sessionRate)} to confirm
                </AppButton>
              )}

              {canCancel && (
                <AppButton
                  variant="destructive"
                  size="md"
                  loading={update.isPending}
            loadingLabel="Cancelling…"
                  onClick={() => void cancel()}
                  style={{ height: 52, fontSize: 15, marginTop: 12, border: '1.6px solid var(--cl-destructive-line)' }}
                >
                  Cancel session
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

export default BookingDetailsPage;
