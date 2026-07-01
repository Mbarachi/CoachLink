import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

const REQUESTS = [
  { id: '0', name: 'John Doe',   initials: 'JD', date: 'Wed, 15 May', time: '8:00 AM' },
  { id: '1', name: 'Amara Eze',  initials: 'AE', date: 'Thu, 16 May', time: '4:00 PM' },
  { id: '2', name: 'Bola Smith', initials: 'BS', date: 'Sat, 18 May', time: '7:00 AM' },
];

const StatCard: React.FC<{ val: string; label: string; dark?: boolean }> = ({ val, label, dark }) => (
  <div style={{ flex: 1, background: dark ? 'var(--cl-ink)' : 'var(--cl-surface)', border: dark ? 'none' : '1px solid var(--cl-border)', borderRadius: 18, padding: 16 }}>
    <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: dark ? 26 : 21, color: dark ? 'var(--cl-accent)' : 'var(--cl-ink)' }}>{val}</div>
    <div style={{ fontSize: 11.5, color: dark ? '#bfae97' : 'var(--cl-muted-1)', marginTop: 3 }}>{label}</div>
  </div>
);

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.firstName ?? 'Tobi';
  const initials = (user?.firstName?.[0] ?? 'T') + (user?.lastName?.[0] ?? 'A');

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

              {/* greeting */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 4 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Good morning,</div>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 25, letterSpacing: '-0.03em', color: 'var(--cl-ink)', marginTop: 1 }}>Coach {firstName}</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 15, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{initials.toUpperCase()}</div>
              </div>

              {/* stat cards row 1 */}
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <StatCard val="3" label="New requests" dark />
                <StatCard val="7" label="Sessions this week" />
              </div>
              {/* stat cards row 2 */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <StatCard val="₦248k" label="Earned this month" />
                <StatCard val="4.8 ★" label="Rating · 32 reviews" />
              </div>

              {/* pending requests */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '24px 0 11px' }}>
                <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 16, color: 'var(--cl-ink)' }}>Pending requests</span>
                <span onClick={() => history.push('/coach/requests')} style={{ fontSize: 12.5, color: 'var(--cl-ink)', fontWeight: 600, cursor: 'pointer' }}>View all</span>
              </div>

              {REQUESTS.map(rq => (
                <div key={rq.id} onClick={() => history.push(`/coach/requests/${rq.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, padding: 13, marginBottom: 10, cursor: 'pointer' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--cl-subtle)', color: 'var(--cl-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{rq.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{rq.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--cl-muted-1)' }}>{rq.date} · {rq.time}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cl-on-accent)', background: 'var(--cl-accent)', padding: '5px 10px', borderRadius: 'var(--cl-radius-chip)' }}>New</span>
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

export default DashboardPage;
