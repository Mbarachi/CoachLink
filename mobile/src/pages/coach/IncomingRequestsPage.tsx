import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const TABS = ['New · 3', 'Accepted', 'Declined'] as const;

const REQUESTS = [
  { id: '0', initials: 'JD', name: 'John Doe',   sport: 'Swimming', date: 'Wed, 15 May', time: '8:00 AM', price: '₦12,000', note: 'Beginner — would like to learn freestyle and build confidence in deep water.' },
  { id: '1', initials: 'AE', name: 'Amara Eze',  sport: 'Swimming', date: 'Thu, 16 May', time: '4:00 PM', price: '₦12,000', note: 'Booking for my daughter. She is a complete beginner.' },
  { id: '2', initials: 'BS', name: 'Bola Smith', sport: 'Swimming', date: 'Sat, 18 May', time: '7:00 AM', price: '₦12,000', note: 'Intermediate — focus on endurance and lap times.' },
];

const IncomingRequestsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState(0);

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ padding: '0 var(--cl-px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 14px' }}>Requests</h1>
            <div style={{ display: 'flex', gap: 8 }}>
              {TABS.map((t, i) => (
                <span key={t} onClick={() => setTab(i)} style={{
                  background: tab === i ? 'var(--cl-ink)' : 'var(--cl-surface)',
                  color: tab === i ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
                  border: tab === i ? 'none' : '1px solid var(--cl-border)',
                  fontWeight: 600, fontSize: 13, padding: '8px 16px',
                  borderRadius: 'var(--cl-radius-chip)', cursor: 'pointer',
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px var(--cl-px) 12px' }}>
            {tab === 0 && REQUESTS.map(rq => (
              <div key={rq.id} onClick={() => history.push(`/coach/requests/${rq.id}`)} style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 18, padding: 15, marginBottom: 12, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--cl-subtle)', color: 'var(--cl-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{rq.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{rq.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{rq.sport} · {rq.date} · {rq.time}</div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{rq.price}</span>
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)', margin: '11px 0 0' }}>{rq.note}</p>
              </div>
            ))}
            {tab !== 0 && (
              <p style={{ fontSize: 14, color: 'var(--cl-muted-1)', textAlign: 'center', marginTop: 40 }}>No requests here yet.</p>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IncomingRequestsPage;
