import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', venue: 'Festival Hotel Pool', price: '₦12,000', rating: '4.8', dist: '1.2km', exp: '5 yrs', initials: 'TA' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   venue: 'MU Court',            price: '₦15,000', rating: '4.9', dist: '2.1km', exp: '7 yrs', initials: 'CO' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', venue: 'Golden Tulip Pool',   price: '₦9,000',  rating: '4.7', dist: '3.0km', exp: '4 yrs', initials: 'EJ' },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   venue: 'MU Court',            price: '₦18,000', rating: '4.6', dist: '2.4km', exp: '6 yrs', initials: 'SD' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', venue: 'School Facilities',   price: '₦7,500',  rating: '4.5', dist: '4.1km', exp: '3 yrs', initials: 'YB' },
];

const CoachListingPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ padding: '0 var(--cl-px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '4px 0 12px' }}>
              <button onClick={() => history.goBack()} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 18, cursor: 'pointer' }}>‹</button>
              <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>Coaches near you</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{COACHES.length} results · Amuwo Odofin</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '7px 13px', borderRadius: 'var(--cl-radius-chip)' }}>Sort: Nearest</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px var(--cl-px) 12px' }}>
            {COACHES.map(co => (
              <div key={co.id} onClick={() => history.push(`/athlete/coaches/${co.id}`)} style={{ display: 'flex', gap: 13, padding: 14, marginBottom: 11, borderRadius: 18, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', cursor: 'pointer' }}>
                <div style={{
                  width: 62, height: 62, borderRadius: 16, flexShrink: 0,
                  backgroundImage: 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 9px, var(--cl-photo-dark-2) 9px 18px)',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
                }}>
                  <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cl-accent)', padding: '6px 8px' }}>{co.initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{co.name}</span>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--cl-ink)' }}>{co.price}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 3 }}>{co.sport} Coach · {co.exp} exp</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--cl-ink)', background: 'var(--cl-subtle)', padding: '4px 9px', borderRadius: 7 }}>★ {co.rating}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--cl-muted-1)' }}>{co.venue} · {co.dist}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CoachListingPage;
