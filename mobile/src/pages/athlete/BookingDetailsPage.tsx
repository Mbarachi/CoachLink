import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import type { PillTone } from '@/components/ui';
import {
  AppButton, AppCard, AppPage, DetailRow, InitialsAvatar,
  PageBody, PageHeader, StatusBar, StatusPill,
} from '@/components/ui';

type Row = { label: string; value: string };

type Detail = {
  initials: string;
  name: string;
  sport: string;
  venue: string;
  typeBadge: string;
  statusBadge: string;
  rows: Row[];
  banner?: string;
  totalCard?: { label: string; value: string };
  cta?: { label: string; kind: 'primary' | 'outline' | 'danger'; onClick: (history: ReturnType<typeof useHistory>) => void };
};

const DETAILS: Record<string, Detail> = {
  pending: {
    initials: 'SD', name: 'Sarah Danjuma', sport: 'Tennis', venue: 'MU Court',
    typeBadge: '', statusBadge: 'Pending',
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
    rows: [
      { label: 'Date', value: 'Fri, 17 May' },
      { label: 'Time', value: '5:00 PM' },
      { label: 'Session fee', value: '₦15,000' },
    ],
  },
  completed: {
    initials: 'EJ', name: 'Emeka Johnson', sport: 'Swimming', venue: 'Golden Tulip Pool',
    typeBadge: 'Single session', statusBadge: 'Completed',
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
    rows: [
      { label: 'Date', value: 'Mon, 13 May' },
      { label: 'Time', value: '6:00 AM' },
      { label: 'Session fee', value: '₦7,500' },
    ],
  },
};

const CTA_VARIANT = { primary: 'primary', outline: 'outline', danger: 'destructive' } as const;

const BookingDetailsPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const detail = DETAILS[bookingId] ?? DETAILS.pending;

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageHeader title="Booking details" onBack={() => history.push('/athlete/bookings')} />
      </div>

      <PageBody>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <InitialsAvatar initials={detail.initials} size={54} radius={15} fontSize={17} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)' }}>{detail.name}</div>
            <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>{detail.sport} · {detail.venue}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {detail.typeBadge && (
            <StatusPill tone={'neutral' as PillTone} style={{ color: 'var(--cl-ink)' }}>{detail.typeBadge}</StatusPill>
          )}
          <StatusPill status={detail.statusBadge} />
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

        <AppCard padding="4px 16px" style={{ borderRadius: 16, marginTop: 16 }}>
          {detail.rows.map((r, i) => (
            <DetailRow
              key={r.label}
              label={r.label}
              value={r.value}
              bold={i === detail.rows.length - 1}
              last={i === detail.rows.length - 1}
            />
          ))}
        </AppCard>

        {detail.cta && (
          <AppButton
            variant={CTA_VARIANT[detail.cta.kind]}
            size="md"
            onClick={() => detail.cta!.onClick(history)}
            style={{ height: 52, fontSize: 15, marginTop: 18, ...(detail.cta.kind === 'danger' ? { border: '1.6px solid #f0c9bb' } : {}) }}
          >
            {detail.cta.label}
          </AppButton>
        )}

        <div style={{ height: 40 }} />
      </PageBody>
    </AppPage>
  );
};

export default BookingDetailsPage;
