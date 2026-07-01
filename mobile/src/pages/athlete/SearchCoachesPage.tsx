import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ALL_COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', venue: 'Festival Hotel Pool', price: '₦12,000', rating: '4.8', initials: 'TA' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   venue: 'MU Court',            price: '₦15,000', rating: '4.9', initials: 'CO' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', venue: 'Golden Tulip Pool',   price: '₦9,000',  rating: '4.7', initials: 'EJ' },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   venue: 'MU Court',            price: '₦18,000', rating: '4.6', initials: 'SD' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', venue: 'School Facilities',   price: '₦7,500',  rating: '4.5', initials: 'YB' },
];

const VENUES = ['MU Court', 'Festival Hotel Pool', 'Golden Tulip Pool', 'School Facilities'];
const SPORTS = ['All sports', 'Swimming', 'Tennis'];

const Chip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <span
    onClick={onClick}
    style={{
      flexShrink: 0,
      background: active ? 'var(--cl-ink)' : 'var(--cl-surface)',
      color: active ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
      border: active ? 'none' : '1px solid var(--cl-border)',
      fontWeight: 600, fontSize: 13,
      padding: '8px 16px', borderRadius: 'var(--cl-radius-chip)',
      cursor: 'pointer',
    }}
  >{label}</span>
);

const SearchCoachesPage: React.FC = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState('All sports');

  const results = ALL_COACHES.filter(c =>
    (sport === 'All sports' || c.sport === sport) &&
    (c.name.toLowerCase().includes(query.toLowerCase()) || c.venue.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ padding: '0 var(--cl-px)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 12px' }}>Search</h1>

            {/* search box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 50, borderRadius: 15, background: 'var(--cl-surface)', border: '1.6px solid var(--cl-ink)', padding: '0 15px' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--cl-ink)' }} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Coach name or venue"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontFamily: 'var(--cl-font-body)', fontSize: 14.5, color: 'var(--cl-ink)' }}
              />
            </div>

            {/* sport chips */}
            <div style={{ display: 'flex', gap: 8, marginTop: 13, overflowX: 'auto', paddingBottom: 3 }}>
              {SPORTS.map(s => <Chip key={s} label={s} active={sport === s} onClick={() => setSport(s)} />)}
            </div>

            {/* venue chips */}
            <div style={{ display: 'flex', gap: 8, marginTop: 9, overflowX: 'auto', paddingBottom: 3 }}>
              {VENUES.map(v => (
                <span key={v} style={{ flexShrink: 0, background: 'var(--cl-subtle)', color: 'var(--cl-ink)', fontWeight: 600, fontSize: 12.5, padding: '7px 14px', borderRadius: 'var(--cl-radius-chip)', cursor: 'pointer' }}>{v}</span>
              ))}
            </div>
          </div>

          {/* results */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px var(--cl-px) 12px' }}>
            <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginBottom: 6 }}>{results.length} coaches near you</div>
            {results.map(co => (
              <div key={co.id} onClick={() => history.push(`/athlete/coaches/${co.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, marginBottom: 10, borderRadius: 'var(--cl-radius-card)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', cursor: 'pointer' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{co.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{co.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>{co.sport} · {co.venue}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{co.price}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>★ {co.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SearchCoachesPage;
