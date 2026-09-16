import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, DetailRow, EmptyIllustration,
  LoadingOverlay, PageBody, PageHeader, QueryState,
} from '@/components/ui';
import { useBooking } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { formatNaira, formatSessionDate } from '@/lib/format';
import { paymentsService } from '@/services';
import { useUiStore } from '@/store/ui.store';
import { queryClient } from '@/lib/queryClient';

const PaymentPage: React.FC = () => {
  const history = useHistory();
  const { bookingRequestId } = useParams<{ bookingRequestId: string }>();
  const showToast = useUiStore((s) => s.showToast);

  // Routed here with a booking id; payment covers the whole request it belongs to.
  const bookingQuery = useBooking(bookingRequestId);
  const booking = bookingQuery.data;

  const [working, setWorking] = useState(false);
  const reference = useRef<string | null>(null);

  /**
   * Paystack's webhook is the authority on whether money moved, but it can
   * arrive late. Asking the server to verify on return means the athlete is
   * not left staring at an unpaid booking they just paid for.
   */
  const settle = useCallback(async () => {
    if (!reference.current) return;
    try {
      const result = await paymentsService.verify(reference.current);
      if (result.paid) {
        reference.current = null;
        await queryClient.invalidateQueries({ queryKey: ['bookings'] });
        showToast('Payment confirmed — your sessions are booked.', 'success');
        history.replace('/athlete/bookings');
      } else {
        showToast('That payment did not go through.', 'warning');
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not confirm that payment.'), 'danger');
    } finally {
      setWorking(false);
    }
  }, [history, showToast]);

  // Returning from the checkout tab is the cue to verify.
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') void settle(); };
    document.addEventListener('visibilitychange', onVisible);
    const resume = App.addListener('appStateChange', ({ isActive }) => { if (isActive) void settle(); });
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      void resume.then((l) => l.remove());
    };
  }, [settle]);

  const pay = async () => {
    if (!booking) return;
    setWorking(true);
    try {
      const init = await paymentsService.initialize({ bookingRequestId: booking.bookingRequestId });
      reference.current = init.reference;
      // Paystack's hosted page, so no card details ever reach this app.
      await Browser.open({ url: init.authorizationUrl });
    } catch (err) {
      setWorking(false);
      showToast(getErrorMessage(err, 'Could not start that payment.'), 'danger');
    }
  };

  return (
    <AppPage padding="screen">
      <LoadingOverlay
        show={working}
        label="Opening Paystack…"
        hint="You'll come back here automatically once the payment is done."
      />
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Payment" />
      </div>

      <PageBody>
        <QueryState isLoading={bookingQuery.isPending} error={bookingQuery.error} onRetry={() => void bookingQuery.refetch()}>
          {!booking ? null : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 18px' }}>
                <EmptyIllustration name="wallet" size={112} />
              </div>

              <AppCard padding="4px 16px" style={{ borderRadius: 16 }}>
                <DetailRow label="Coach" value={`${booking.coach.firstName} ${booking.coach.lastName}`.trim()} />
                <DetailRow label="Sport" value={booking.sport.name} />
                <DetailRow label="Venue" value={booking.coach.venue} />
                <DetailRow label="Next session" value={formatSessionDate(booking.scheduledAt)} />
                <DetailRow label="Per session" value={formatNaira(booking.sessionRate)} bold last />
              </AppCard>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 13, padding: 13, marginTop: 16 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
                <span style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)' }}>
                  One payment covers every unpaid session on this booking. You&apos;ll pay on
                  Paystack&apos;s secure page — your card details never reach CoachLink.
                </span>
              </div>

              <AppButton onClick={() => void pay()} loading={working}
            loadingLabel="Opening Paystack…" style={{ marginTop: 22 }}>
                Pay with Paystack
              </AppButton>

              <div style={{ height: 40 }} />
            </>
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default PaymentPage;
