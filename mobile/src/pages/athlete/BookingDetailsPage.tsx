import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

type Row = { label: string; value: string };

type Detail = {
  initials: string;
  name: string;
  sport: string;
  venue: string;
  typeBadge: string;
  statusBadge: string;
  statusBadgeStyle: React.CSSProperties;
  rows: Row[];
  banner?: string;
  totalCard?: { label: string; value: string };
  cta?: { label: string; kind: 'primary' | 'outline' | 'danger'; onClick: (history: ReturnType<typeof useHistory>) => void };
};

const DETAILS: Record<string, Detail> = {
  pending: {
    initials: 'SD', name: 'Sarah Danjuma', sport: 'Tennis', venue: 'MU Court',
    typeBadge: '', statusBadge: 'Pending',
    statusBadgeStyle: { background: 'var(--cl-pending-bg)', color: 'var(--cl-pending-text)' },
    banner: "Waiting for Sarah Danjuma to accept your request. You'll be notified — and only pay — once she accepts.",
    rows: [
      { label: 'Date', value: 'Sat, 18 May' },
      { label: 'Time', value: '10:00 AM' },
      { label: 'Session fee', value: '₦18,000' },
    ],
    cta: { label: 'Cancel request', kind: 'danger', onClick: (history) => history.push('/athlete/bookings') },
  },
  'accepted-package': {
    initials: 'TA', name: 'Tobi Adebayo', sport: 'Swimming', venue: 'Festival Hotel Pool',
    typeBadge: 'Weekly package', statusBadge: 'Accepted',
    statusBadgeStyle: { background: 'var(--cl-accent)', color: 'var(--cl-on-accent)' },
    totalCard: { label: 'Total for package', value: '₦96,000' },
    rows: [
      { label: 'Schedule', value: 'Wed & Fri' },
      { label: 'Time', value: '8:00 AM' },
      { label: 'Starts', value: 'Wed, 15 May' },
      { label: 'Duration', value: '4 weeks · 8 sessions' },
      { label: 'Per-session rate', value: '₦12,000' },
    ],
    cta: {
      label: 'Pay ₦96,000 to confirm', kind: 'primary',
      onClick: (history) => history.push('/athlete/payment/accepted-package', {
        mode: 'package', sessionsCount: 8, totalPrice: '₦96,000', coachName: 'Tobi Adebayo', coachInitials: 'TA', coachSport: 'Swimming',
      }),
    },
  },
  'confirmed-single': {
    initials: 'CO', name: 'Chidinma Okafor', sport: 'Tennis', venue: 'MU Court',
    typeBadge: 'Single session', statusBadge: 'Confirmed',
    statusBadgeStyle: { background: 'var(--cl-success-bg)', color: 'var(--cl-success-text)' },
    rows: [
      { label: 'Date', value: 'Fri, 17 May' },
      { label: 'Time', value: '5:00 PM' },
      { label: 'Session fee', value: '₦15,000' },
    ],
  },
  completed: {
    initials: 'EJ', name: 'Emeka Johnson', sport: 'Swimming', venue: 'Golden Tulip Pool',
    typeBadge: 'Single session', statusBadge: 'Completed',
    statusBadgeStyle: { background: 'var(--cl-subtle)', color: 'var(--cl-muted-1)' },
    rows: [
      { label: 'Date', value: 'Sat, 18 May' },
      { label: 'Time', value: '7:00 AM' },
      { label: 'Session fee', value: '₦9,000' },
    ],
    cta: { label: 'Leave a review', kind: 'outline', onClick: (history) => history.push('/athlete/bookings/completed/review') },
  },
  cancelled: {
    initials: 'YB', name: 'Yusuf Bello', sport: 'Swimming', venue: 'Golden Tulip Pool',
    typeBadge: 'Single session', statusBadge: 'Cancelled',
    statusBadgeStyle: { background: 'var(--cl-subtle)', color: 'var(--cl-muted-1)' },
    rows: [
      { label: 'Date', value: 'Mon, 13 May' },
      { label: 'Time', value: '6:00 AM' },
      { label: 'Session fee', value: '₦7,500' },
    ],
  },
};

const ctaStyle: Record<'primary' | 'outline' | 'danger', React.CSSProperties> = {
  primary: { border: 'none', background: 'var(--cl-accent)', color: 'var(--cl-on-accent)' },
  outline: { border: '1.6px solid var(--cl-ink)', background: 'var(--cl-surface)', color: 'var(--cl-ink)' },
  danger:  { border: '1.6px solid #f0c9bb', background: 'var(--cl-surface)', color: 'var(--cl-destructive)' },
};

const BookingDetailsPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const detail = DETAILS[bookingId] ?? DETAILS.pending;

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ flexShrink: 0, padding: '0 var(--cl-px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '4px 0 14px' }}>
              <button onClick={() => history.push('/athlete/bookings')} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 18, cursor: 'pointer' }}>‹</button>
              <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>Booking details</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--cl-px) 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 54, height: 54, borderRadius: 15, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 17, flexShrink: 0 }}>{detail.initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)' }}>{detail.name}</div>
                <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>{detail.sport} · {detail.venue}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {detail.typeBadge && (
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cl-ink)', background: 'var(--cl-subtle)', padding: '5px 10px', borderRadius: 'var(--cl-radius-chip)' }}>{detail.typeBadge}</span>
              )}
              <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 'var(--cl-radius-chip)', ...detail.statusBadgeStyle }}>{detail.statusBadge}</span>
            </div>

            {detail.banner && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 14, padding: 14, marginTop: 16 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
                <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>{detail.banner}</span>
              </div>
            )}

            {detail.totalCard && (
              <div style={{ background: 'var(--cl-ink)', borderRadius: 18, padding: 20, marginTop: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--cl-bfae97)' }}>{detail.totalCard.label}</div>
                <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 24, color: 'var(--cl-surface)', marginTop: 4 }}>{detail.totalCard.value}</div>
              </div>
            )}

            <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, padding: '4px 16px', marginTop: 16 }}>
              {detail.rows.map((r, i) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < detail.rows.length - 1 ? '1px solid var(--cl-subtle)' : 'none' }}>
                  <span style={{ fontSize: 13.5, color: 'var(--cl-muted-1)' }}>{r.label}</span>
                  <span style={{ fontSize: 13.5, fontWeight: i === detail.rows.length - 1 ? 700 : 600, color: 'var(--cl-ink)' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {detail.cta && (
              <button onClick={() => detail.cta!.onClick(history)} style={{ width: '100%', height: 52, borderRadius: 15, fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 18, ...ctaStyle[detail.cta.kind] }}>
                {detail.cta.label}
              </button>
            )}

            <div style={{ height: 40 }} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingDetailsPage;
