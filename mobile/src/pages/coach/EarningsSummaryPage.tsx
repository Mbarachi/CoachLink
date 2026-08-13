import React from 'react';

import { AppButton, AppCard, AppPage, PageBody, PageTitle, SectionHeading, StatusBar } from '@/components/ui';

const TRANSACTIONS = [
  { name: 'Chidinma — Tennis',         date: 'Fri, 17 May', amount: '+₦15,000' },
  { name: 'John Doe — Swimming',        date: 'Wed, 15 May', amount: '+₦12,000' },
  { name: 'Bola Smith — Swimming',      date: 'Sat, 11 May', amount: '+₦12,000' },
  { name: 'Payout to GTBank ••• 4021',  date: 'Mon, 6 May',  amount: '−₦180,000' },
];

const STATS = [
  { val: '21', label: 'Sessions' },
  { val: '₦12k', label: 'Avg / session' },
  { val: '+18%', label: 'vs April' },
];

const EarningsSummaryPage: React.FC = () => (
  <AppPage padding="screen">
    <PageBody pb={96}>
      <StatusBar />
      <PageTitle style={{ margin: '8px 0 16px' }}>Earnings</PageTitle>

      {/* available to withdraw card */}
      <div style={{ background: 'var(--cl-ink)', borderRadius: 20, padding: 20 }}>
        <div style={{ fontSize: 12.5, color: 'var(--cl-bfae97)' }}>Available to withdraw</div>
        <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 36, color: 'var(--cl-surface)', margin: '4px 0 2px' }}>₦68,000</div>
        <div style={{ fontSize: 12, color: 'var(--cl-bfae97)' }}>₦248,000 earned this month</div>
        <AppButton style={{ marginTop: 15, height: 48, borderRadius: 13, fontSize: 14.5 }}>Withdraw to bank</AppButton>
      </div>

      {/* stat tiles */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {STATS.map(s => (
          <AppCard key={s.label} padding={14} style={{ flex: 1, borderRadius: 16 }}>
            <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 20, color: 'var(--cl-ink)' }}>{s.val}</div>
            <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>{s.label}</div>
          </AppCard>
        ))}
      </div>

      {/* transactions */}
      <SectionHeading style={{ fontSize: 15, margin: '22px 0 8px' }}>Transactions</SectionHeading>
      {TRANSACTIONS.map((tx, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--cl-border)' }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--cl-subtle)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--cl-ink)' }}>{tx.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)' }}>{tx.date}</div>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: tx.amount.startsWith('+') ? 'var(--cl-ink)' : 'var(--cl-destructive)' }}>{tx.amount}</span>
        </div>
      ))}
    </PageBody>
  </AppPage>
);

export default EarningsSummaryPage;
