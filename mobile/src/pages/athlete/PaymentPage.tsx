import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', price: '₦12,000' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   price: '₦15,000' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', price: '₦9,000'  },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   price: '₦18,000' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', price: '₦7,500'  },
];

const PaymentPage: React.FC = () => {
  const history = useHistory();
  const { bookingRequestId } = useParams<{ bookingRequestId: string }>();
  const coach = COACHES[Number(bookingRequestId)] ?? COACHES[0];
  const [method, setMethod] = useState<'card' | 'bank'>('card');

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
              <button onClick={() => history.goBack()} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 18, cursor: 'pointer' }}>‹</button>
              <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>Payment</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--cl-px) 12px' }}>
            {/* total due card */}
            <div style={{ background: 'var(--cl-ink)', borderRadius: 18, padding: 20 }}>
              <div style={{ fontSize: 12.5, color: '#bfae97' }}>Total due</div>
              <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 34, color: 'var(--cl-surface)', marginTop: 4 }}>{coach.price}</div>
              <div style={{ fontSize: 12.5, color: '#bfae97', marginTop: 4 }}>1 session with {coach.name} · {coach.sport}</div>
            </div>

            {/* fee breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--cl-muted-3)', margin: '18px 2px 0' }}>
              <span>Session fee</span><span style={{ color: 'var(--cl-ink)', fontWeight: 600 }}>{coach.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--cl-muted-3)', margin: '9px 2px 0' }}>
              <span>Service fee</span><span style={{ color: 'var(--cl-ink)', fontWeight: 600 }}>₦0</span>
            </div>
            <div style={{ height: 1, background: 'var(--cl-border)', margin: '14px 0' }} />

            <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '0 0 11px' }}>Pay with</h4>

            {/* card option */}
            <div onClick={() => setMethod('card')} style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'var(--cl-surface)', border: method === 'card' ? '1.6px solid var(--cl-ink)' : '1px solid var(--cl-border)', borderRadius: 14, padding: 14, marginBottom: 10, cursor: 'pointer' }}>
              <div style={{ width: 42, height: 30, borderRadius: 7, background: 'var(--cl-subtle)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>Card · Paystack</div>
                <div style={{ fontSize: 12, color: 'var(--cl-muted-1)' }}>Visa ending 4242</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: method === 'card' ? 'var(--cl-ink)' : 'transparent', border: method === 'card' ? 'none' : '1.6px solid var(--cl-muted-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cl-accent)', fontSize: 12 }}>
                {method === 'card' && '✓'}
              </div>
            </div>

            {/* bank option */}
            <div onClick={() => setMethod('bank')} style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'var(--cl-surface)', border: method === 'bank' ? '1.6px solid var(--cl-ink)' : '1px solid var(--cl-border)', borderRadius: 14, padding: 14, cursor: 'pointer' }}>
              <div style={{ width: 42, height: 30, borderRadius: 7, background: 'var(--cl-subtle)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>Bank transfer</div>
                <div style={{ fontSize: 12, color: 'var(--cl-muted-1)' }}>Pay via your bank app</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: method === 'bank' ? 'var(--cl-ink)' : 'transparent', border: method === 'bank' ? 'none' : '1.6px solid var(--cl-muted-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cl-accent)', fontSize: 12 }}>
                {method === 'bank' && '✓'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16, color: 'var(--cl-muted-1)', fontSize: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: 5, background: 'var(--cl-subtle)', flexShrink: 0 }} />
              Secured by Paystack · 256-bit encryption
            </div>
          </div>

          {/* sticky footer */}
          <div style={{ flexShrink: 0, padding: '14px var(--cl-px) 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            <button onClick={() => history.push('/athlete/booking-success/paid')} style={{ width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>
              Pay {coach.price}
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PaymentPage;
