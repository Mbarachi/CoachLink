import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', venue: 'Festival Hotel Pool', price: '₦12,000', rating: '4.8', dist: '1.2km', initials: 'TA' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   venue: 'MU Court',            price: '₦15,000', rating: '4.9', dist: '2.1km', initials: 'CO' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', venue: 'Golden Tulip Pool',   price: '₦9,000',  rating: '4.7', dist: '3.0km', initials: 'EJ' },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   venue: 'MU Court',            price: '₦18,000', rating: '4.6', dist: '2.4km', initials: 'SD' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', venue: 'School Facilities',   price: '₦7,500',  rating: '4.5', dist: '4.1km', initials: 'YB' },
];

const HomePage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          {/* fixed header */}
          <div style={{ padding: '0 var(--cl-px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 4 }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.1em', color: 'var(--cl-muted-2)' }}>YOUR AREA</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--cl-ink)', marginTop: 2 }}>Amuwo Odofin, Lagos</div>
              </div>
              <div
                onClick={() => history.push('/athlete/notifications')}
                style={{
                  width: 40, height: 40, borderRadius: 13,
                  border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', cursor: 'pointer',
                }}
              >
                <div style={{ width: 14, height: 14, border: '1.8px solid var(--cl-ink)', borderRadius: '4px 4px 7px 7px' }} />
                <div style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: '50%', background: 'var(--cl-accent)', border: '1.5px solid var(--cl-surface)' }} />
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 29, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '15px 0 12px' }}>Find a coach</h1>
            <div
              onClick={() => history.push('/athlete/search')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, height: 50, borderRadius: 15, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '0 15px', cursor: 'pointer' }}
            >
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--cl-muted-line)' }} />
              <span style={{ color: 'var(--cl-muted-2)', fontSize: 14.5 }}>Search coaches or venues</span>
            </div>
          </div>

          {/* scroll body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0 12px' }}>
            {/* Browse by sport */}
            <div style={{ padding: '0 var(--cl-px)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>Browse by sport</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 11, overflowX: 'auto', padding: '0 var(--cl-px) 4px' }}>
              {/* Swimming */}
              <div onClick={() => history.push('/athlete/search')} style={{ flex: 'none', width: 138, height: 92, borderRadius: 18, background: 'var(--cl-ink)', padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--cl-accent)' }} />
                <div>
                  <div style={{ color: 'var(--cl-surface)', fontWeight: 700, fontSize: 15 }}>Swimming</div>
                  <div style={{ color: 'var(--cl-muted-2)', fontSize: 11.5 }}>18 coaches</div>
                </div>
              </div>
              {/* Tennis */}
              <div onClick={() => history.push('/athlete/search')} style={{ flex: 'none', width: 138, height: 92, borderRadius: 18, background: 'var(--cl-accent)', padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--cl-ink)' }} />
                <div>
                  <div style={{ color: 'var(--cl-ink)', fontWeight: 700, fontSize: 15 }}>Tennis</div>
                  <div style={{ color: 'var(--cl-surface)', fontSize: 11.5 }}>11 coaches</div>
                </div>
              </div>
              {/* All venues */}
              <div onClick={() => history.push('/athlete/search')} style={{ flex: 'none', width: 138, height: 92, borderRadius: 18, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--cl-subtle)' }} />
                <div>
                  <div style={{ color: 'var(--cl-ink)', fontWeight: 700, fontSize: 15 }}>All venues</div>
                  <div style={{ color: 'var(--cl-muted-2)', fontSize: 11.5 }}>5 nearby</div>
                </div>
              </div>
            </div>

            {/* Top coaches */}
            <div style={{ padding: '20px var(--cl-px) 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>Top coaches near you</span>
                <span onClick={() => history.push('/athlete/coaches')} style={{ fontSize: 12.5, color: 'var(--cl-ink)', fontWeight: 600, cursor: 'pointer' }}>See all</span>
              </div>
            </div>
            <div style={{ padding: '0 var(--cl-px)' }}>
              {COACHES.map((co) => (
                <div key={co.id} onClick={() => history.push(`/athlete/coaches/${co.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 0', borderBottom: '1px solid var(--cl-border)', cursor: 'pointer' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 15, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 17, flexShrink: 0 }}>{co.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{co.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>{co.sport} · {co.venue}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{co.price}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>★ {co.rating} · {co.dist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
