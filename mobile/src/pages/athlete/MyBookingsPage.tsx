import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const TABS = ['Upcoming', 'Completed', 'Cancelled'] as const;

export const BOOKINGS = [
  { id: 'pending',          initials: 'SD', name: 'Sarah Danjuma',   sport: 'Tennis',   venue: 'MU Court',            date: 'Sat, 18 May', time: '10:00 AM', status: 'Pending',   price: '₦18,000', coachId: '3' },
  { id: 'accepted-package', initials: 'TA', name: 'Tobi Adebayo',    sport: 'Swimming', venue: 'Festival Hotel Pool', date: 'Wed & Fri',   time: '8:00 AM',  status: 'Accepted',  price: '₦96,000', coachId: '0' },
  { id: 'confirmed-single', initials: 'CO', name: 'Chidinma Okafor', sport: 'Tennis',   venue: 'MU Court',            date: 'Fri, 17 May', time: '5:00 PM',  status: 'Confirmed', price: '₦15,000', coachId: '1' },
  { id: 'completed',        initials: 'EJ', name: 'Emeka Johnson',   sport: 'Swimming', venue: 'Golden Tulip Pool',   date: 'Sat, 18 May', time: '7:00 AM',  status: 'Completed', price: '₦9,000',  coachId: '2' },
  { id: 'cancelled',        initials: 'YB', name: 'Yusuf Bello',     sport: 'Swimming', venue: 'Golden Tulip Pool',   date: 'Mon, 13 May', time: '6:00 AM',  status: 'Cancelled', price: '₦7,500',  coachId: '4' },
];

const TAB_STATUSES: Record<typeof TABS[number], string[]> = {
  Upcoming: ['Pending', 'Accepted', 'Confirmed'],
  Completed: ['Completed'],
  Cancelled: ['Cancelled'],
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, React.CSSProperties> = {
    Pending:   { background: 'var(--cl-pending-bg)', color: 'var(--cl-pending-text)' },
    Accepted:  { background: 'var(--cl-accent)',    color: 'var(--cl-on-accent)' },
    Confirmed: { background: 'var(--cl-success-bg)', color: 'var(--cl-success-text)' },
    Completed: { background: 'var(--cl-subtle)',     color: 'var(--cl-muted-1)' },
    Cancelled: { background: 'var(--cl-subtle)',     color: 'var(--cl-muted-1)' },
  };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 'var(--cl-radius-chip)', ...(styles[status] ?? {}) }}>
      {status}
    </span>
  );
};

const MyBookingsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState<typeof TABS[number]>('Upcoming');
  const visible = BOOKINGS.filter(b => TAB_STATUSES[tab].includes(b.status));

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ padding: '0 var(--cl-px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 14px' }}>My bookings</h1>
            <div style={{ display: 'flex', gap: 8 }}>
              {TABS.map(t => (
                <span key={t} onClick={() => setTab(t)} style={{
                  background: tab === t ? 'var(--cl-ink)' : 'var(--cl-surface)',
                  color: tab === t ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
                  border: tab === t ? 'none' : '1px solid var(--cl-border)',
                  fontWeight: 600, fontSize: 13, padding: '8px 16px',
                  borderRadius: 'var(--cl-radius-chip)', cursor: 'pointer',
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px var(--cl-px) 12px' }}>
            {visible.map(b => (
              <div key={b.id} onClick={() => history.push(`/athlete/bookings/${b.id}`)} style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 18, padding: 15, marginBottom: 13, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{b.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{b.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{b.sport} · {b.venue}</div>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 13, fontSize: 12.5, color: 'var(--cl-muted-3)' }}>
                  <span>📅 {b.date}</span>
                  <span>🕗 {b.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyBookingsPage;
