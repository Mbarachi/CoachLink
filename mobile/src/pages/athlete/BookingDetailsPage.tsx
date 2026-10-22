import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, DetailRow, InitialsAvatar,
  PageBody, PageHeader, QueryState, StarRating, StatusPill,
} from '@/components/ui';
import { useBooking, useBookingReview, useStartCode, useUpdateBooking } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import {
  formatNaira, formatSessionDate, formatSessionTime, fullName, initialsOf,
} from '@/lib/format';
import { shownStatus } from '@/lib/sessions';
import { SUPPORT_EMAIL } from '@/lib/support';
import { useUiStore } from '@/store/ui.store';

const BANNERS: Partial<Record<string, string>> = {
  PENDING_PAYMENT: 'Your coach accepted. Pay to confirm this session — payments go live shortly.',
  UPCOMING: `Confirmed. Your coach is expecting you. Paid sessions can’t be cancelled in the app, so if something comes up, email ${SUPPORT_EMAIL} and we’ll help.`,
  COMPLETED: 'This session is done.',
  CANCELLED: 'This session was cancelled.',
  AWAITING_CONFIRMATION: 'This session’s time has passed. Your coach will confirm it took place, and then you can leave a review.',
  NOT_PAID: 'This session started before it was paid for, so it did not go ahead.',
  IN_PROGRESS: 'In progress. Your coach started the session with your code.',
};

const BookingDetailsPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const showToast = useUiStore((s) => s.showToast);

  const query = useBooking(bookingId);
  const update = useUpdateBooking(bookingId);
  const booking = query.data;
  // Only asked for once the session is done: on every other status the answer
  // is known to be none.
  const review = useBookingReview(booking?.status === 'COMPLETED' ? bookingId : undefined);

  const cancel = async () => {
    try {
      await update.mutateAsync({ status: 'CANCELLED' });
      showToast('Session cancelled.', 'success');
      history.push('/athlete/bookings');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not cancel this session.'), 'danger');
    }
  };

  const shown = booking ? shownStatus(booking) : undefined;
  // Paid, not started, not over: the window in which the code is any use.
  const startCode = useStartCode(bookingId, shown === 'UPCOMING');
  // Only before payment. A paid session stands (the server refuses it too),
  // and once its hour is over there is nothing left to call off.
  const canCancel = shown === 'PENDING_PAYMENT';

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Session details" onBack={() => history.push('/athlete/bookings')} />
      </div>

      <PageBody refreshable>
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
                <StatusPill status={shown} />
              </div>

              {shown && BANNERS[shown] && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 14, padding: 14, marginTop: 16 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink-fill)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>{BANNERS[shown!]}</span>
                </div>
              )}

              {/* Like a ride's PIN: the coach types it in when they meet, which
                  starts the session and shows both of them were there. */}
              {shown === 'UPCOMING' && (
                <AppCard style={{ borderRadius: 16, marginTop: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: 'var(--cl-muted-2)' }}>START CODE</div>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 38, letterSpacing: '.3em', color: 'var(--cl-ink)', margin: '6px 0 4px', paddingLeft: '.3em' }}>
                    {startCode.data ?? (startCode.isError ? '— — — —' : '· · · ·')}
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-1)' }}>
                    {startCode.isError
                      ? 'Could not load your code. Pull down to try again.'
                      : `Show this to ${booking.coach.firstName || 'your coach'} when you arrive. They type it in to start your session.`}
                  </div>
                </AppCard>
              )}

              <AppCard padding="4px 16px" style={{ borderRadius: 16, marginTop: 16 }}>
                <DetailRow label="Date" value={formatSessionDate(booking.scheduledAt)} />
                <DetailRow label="Time" value={formatSessionTime(booking.scheduledAt)} />
                <DetailRow label="Venue" value={booking.coach.venue} />
                <DetailRow label="Session fee" value={formatNaira(booking.sessionRate)} bold last />
              </AppCard>

              {shown === 'PENDING_PAYMENT' && (
                <AppButton
                  size="md"
                  onClick={() => history.push(`/athlete/payment/${booking.id}`)}
                  style={{ height: 52, fontSize: 15, marginTop: 18 }}
                >
                  Pay {formatNaira(booking.sessionRate)} to confirm
                </AppButton>
              )}

              {booking.status === 'COMPLETED' && !review.isPending && (
                review.data ? (
                  <AppCard style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cl-muted-3)', marginBottom: 8 }}>
                      Your review
                    </div>
                    <StarRating value={review.data.rating} size={18} />
                    {review.data.comment && (
                      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--cl-muted-3)', margin: '10px 0 0' }}>
                        {review.data.comment}
                      </p>
                    )}
                  </AppCard>
                ) : (
                  <AppButton
                    size="md"
                    onClick={() => history.push(`/athlete/bookings/${booking.id}/review`)}
                    style={{ height: 52, fontSize: 15, marginTop: 18 }}
                  >
                    Leave a review
                  </AppButton>
                )
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
