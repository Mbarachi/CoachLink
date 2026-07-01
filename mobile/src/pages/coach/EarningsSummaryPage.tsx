import { IonContent, IonPage } from '@ionic/react';
import React from 'react';

const TRANSACTIONS = [
  { name: 'Chidinma — Tennis',           date: 'Fri, 17 May',  amount: '+₦15,000' },
  { name: 'John Doe — Swimming',          date: 'Wed, 15 May',  amount: '+₦12,000' },
  { name: 'Bola Smith — Swimming',        date: 'Sat, 11 May',  amount: '+₦12,000' },
  { name: 'Payout to GTBank ••• 4021',   date: 'Mon, 6 May',   amount: '−₦180,000' },
];

const EarningsSummaryPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '0 var(--cl-px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
                <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
              </div>
              <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 16px' }}>Earnings</h1>

              {/* available to withdraw card */}
              <div style={{ background: 'var(--cl-ink)', borderRadius: 20, padding: 20 }}>
                <div style={{ fontSize: 12.5, color: '#bfae97' }}>Available to withdraw</div>
                <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 36, color: 'var(--cl-surface)', margin: '4px 0 2px' }}>₦68,000</div>
                <div style={{ fontSize: 12, color: '#bfae97' }}>₦248,000 earned this month</div>
                <button style={{ marginTop: 15, width: '100%', height: 48, border: 'none', borderRadius: 13, background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}>Withdraw to bank</button>
              </div>

              {/* stat tiles */}
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                {[{ val: '21', label: 'Sessions' }, { val: '₦12k', label: 'Avg / session' }, { val: '+18%', label: 'vs April' }].map(s => (
                  <div key={s.label} style={{ flex: 1, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, padding: 14 }}>
                    <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 20, color: 'var(--cl-ink)' }}>{s.val}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* transactions */}
              <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)', margin: '22px 0 8px' }}>Transactions</h4>
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

              <div style={{ height: 96 }} />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EarningsSummaryPage;
