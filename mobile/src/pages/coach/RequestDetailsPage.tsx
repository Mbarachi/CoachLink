import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const REQUESTS = [
  { id: '0', initials: 'JD', name: 'John Doe',   sport: 'Swimming', date: 'Wed, 15 May', time: '8:00 AM', venue: 'Festival Hotel Pool', price: '₦12,000', note: 'Beginner — would like to learn freestyle and build confidence in deep water.', child: '' },
  { id: '1', initials: 'AE', name: 'Amara Eze',  sport: 'Swimming', date: 'Thu, 16 May', time: '4:00 PM', venue: 'Festival Hotel Pool', price: '₦12,000', note: 'Booking for my daughter. She is a complete beginner.', child: 'Zara, age 9' },
  { id: '2', initials: 'BS', name: 'Bola Smith', sport: 'Swimming', date: 'Sat, 18 May', time: '7:00 AM', venue: 'Festival Hotel Pool', price: '₦12,000', note: 'Intermediate — focus on endurance and lap times.', child: '' },
];

const DetailRow: React.FC<{ label: string; value: string; last?: boolean }> = ({ label, value, last }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: last ? 'none' : '1px solid var(--cl-subtle)' }}>
    <span style={{ fontSize: 13.5, color: 'var(--cl-muted-1)' }}>{label}</span>
    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cl-ink)' }}>{value}</span>
  </div>
);

const RequestDetailsPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const req = REQUESTS[Number(id)] ?? REQUESTS[0];

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
              <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>Request details</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--cl-px) 12px' }}>
            {/* athlete header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--cl-subtle)', color: 'var(--cl-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{req.initials}</div>
              <div>
                <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cl-ink)' }}>{req.name}</div>
                <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Requested a {req.sport} session</div>
              </div>
            </div>

            {/* child banner */}
            {req.child && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cl-accent)', borderRadius: 14, padding: 13, marginTop: 16 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--cl-ink)', flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: 'var(--cl-ink)' }}><strong>Booking for a child:</strong> {req.child}</div>
              </div>
            )}

            {/* details table */}
            <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, padding: '4px 16px', marginTop: 16 }}>
              <DetailRow label="Date"        value={req.date} />
              <DetailRow label="Time"        value={req.time} />
              <DetailRow label="Venue"       value={req.venue} />
              <DetailRow label="Session fee" value={req.price} last />
            </div>

            {/* note */}
            <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '18px 0 8px' }}>Note from athlete</h4>
            <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 14, padding: 14, fontSize: 13.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>{req.note}</div>

            <div style={{ height: 96 }} />
          </div>

          {/* sticky footer */}
          <div style={{ flexShrink: 0, display: 'flex', gap: 10, padding: '14px var(--cl-px) 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            <button onClick={() => history.goBack()} style={{ flex: 1, height: 54, border: '1.6px solid var(--cl-ink)', borderRadius: 15, background: 'var(--cl-surface)', color: 'var(--cl-ink)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Decline</button>
            <button onClick={() => history.goBack()} style={{ flex: 2, height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Accept &amp; request payment</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RequestDetailsPage;
