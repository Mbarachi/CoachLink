import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, PageBody,
  PageHeader, SectionHeading, StatusBar, StickyFooter,
} from '@/components/ui';

const COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', price: '₦12,000' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   price: '₦15,000' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', price: '₦9,000'  },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   price: '₦18,000' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', price: '₦7,500'  },
];

type PackageState = {
  mode: 'package';
  sessionsCount: number;
  totalPrice: string;
  coachName: string;
  coachSport: string;
};

const METHODS = [
  { key: 'card' as const, title: 'Card · Paystack', sub: 'Visa ending 4242' },
  { key: 'bank' as const, title: 'Bank transfer', sub: 'Pay via your bank app' },
];

const PaymentPage: React.FC = () => {
  const history = useHistory();
  const { bookingRequestId } = useParams<{ bookingRequestId: string }>();
  const location = useLocation<PackageState | undefined>();
  const packageState = location.state?.mode === 'package' ? location.state : undefined;
  const fallbackCoach = COACHES[Number(bookingRequestId)] ?? COACHES[0];
  const [method, setMethod] = useState<'card' | 'bank'>('card');

  const totalDue = packageState ? packageState.totalPrice : fallbackCoach.price;
  const subtitle = packageState
    ? `${packageState.sessionsCount} sessions with ${packageState.coachName} · ${packageState.coachSport}`
    : `1 session with ${fallbackCoach.name} · ${fallbackCoach.sport}`;
  const feeLabel = packageState ? `${packageState.sessionsCount} sessions` : 'Session fee';

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageHeader title="Payment" />
      </div>

      <PageBody>
        {/* total due card */}
        <div style={{ background: 'var(--cl-ink)', borderRadius: 18, padding: 20 }}>
          <div style={{ fontSize: 12.5, color: 'var(--cl-bfae97)' }}>Total due</div>
          <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 34, color: 'var(--cl-surface)', marginTop: 4 }}>{totalDue}</div>
          <div style={{ fontSize: 12.5, color: 'var(--cl-bfae97)', marginTop: 4 }}>{subtitle}</div>
        </div>

        {/* fee breakdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--cl-muted-3)', margin: '18px 2px 0' }}>
          <span>{feeLabel}</span><span style={{ color: 'var(--cl-ink)', fontWeight: 600 }}>{totalDue}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--cl-muted-3)', margin: '9px 2px 0' }}>
          <span>Service fee</span><span style={{ color: 'var(--cl-ink)', fontWeight: 600 }}>₦0</span>
        </div>
        <div style={{ height: 1, background: 'var(--cl-border)', margin: '14px 0' }} />

        <SectionHeading style={{ margin: '0 0 11px' }}>Pay with</SectionHeading>

        {METHODS.map((m, i) => (
          <AppCard
            key={m.key}
            onClick={() => setMethod(m.key)}
            selected={method === m.key}
            padding={14}
            style={{ display: 'flex', alignItems: 'center', gap: 13, borderRadius: 14, marginBottom: i < METHODS.length - 1 ? 10 : 0 }}
          >
            <div style={{ width: 42, height: 30, borderRadius: 7, background: 'var(--cl-subtle)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{m.title}</div>
              <div style={{ fontSize: 12, color: 'var(--cl-muted-1)' }}>{m.sub}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: method === m.key ? 'var(--cl-ink)' : 'transparent', border: method === m.key ? 'none' : '1.6px solid var(--cl-muted-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cl-accent)', fontSize: 12 }}>
              {method === m.key && '✓'}
            </div>
          </AppCard>
        ))}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16, color: 'var(--cl-muted-1)', fontSize: 12 }}>
          <div style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--cl-subtle)', flexShrink: 0 }} />
          Secured by Paystack · 256-bit encryption
        </div>
      </PageBody>

      <StickyFooter style={{ paddingLeft: 0, paddingRight: 0 }}>
        <AppButton
          size="md"
          onClick={() => history.push('/athlete/booking-success/paid', {
            coachName: packageState ? packageState.coachName : fallbackCoach.name,
          })}
        >
          Pay {totalDue}
        </AppButton>
      </StickyFooter>
    </AppPage>
  );
};

export default PaymentPage;
