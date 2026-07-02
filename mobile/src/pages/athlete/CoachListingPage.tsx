import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { mockCoaches } from '@/features/coaches/data/mockCoaches';

type SortKey = 'Highest Rated' | 'Lowest Price' | 'Most Experienced';
const SORT_OPTIONS: SortKey[] = ['Highest Rated', 'Lowest Price', 'Most Experienced'];

function sorted(coaches: typeof mockCoaches, key: SortKey) {
  return [...coaches].sort((a, b) => {
    if (key === 'Highest Rated')    return b.rating - a.rating;
    if (key === 'Lowest Price')     return a.sessionRate - b.sessionRate;
    if (key === 'Most Experienced') return b.yearsOfExperience - a.yearsOfExperience;
    return 0;
  });
}

const CoachListingPage: React.FC = () => {
  const history = useHistory();
  const [sortKey, setSortKey] = useState<SortKey>('Highest Rated');
  const [showSort, setShowSort] = useState(false);

  const coaches = sorted(mockCoaches, sortKey);

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <span style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{coaches.length} results · Amuwo Odofin</span>

              {/* sort dropdown */}
              <div style={{ position: 'relative' }}>
                <span
                  onClick={() => setShowSort(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '7px 13px', borderRadius: 'var(--cl-radius-chip)', cursor: 'pointer' }}
                >
                  Sort: {sortKey}
                </span>
                {showSort && (
                  <div style={{ position: 'absolute', right: 0, top: 38, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 12, overflow: 'hidden', zIndex: 10, minWidth: 170, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
                    {SORT_OPTIONS.map(opt => (
                      <div
                        key={opt}
                        onClick={() => { setSortKey(opt); setShowSort(false); }}
                        style={{ padding: '11px 16px', fontSize: 13, fontWeight: sortKey === opt ? 700 : 400, color: sortKey === opt ? 'var(--cl-accent)' : 'var(--cl-ink)', cursor: 'pointer', borderBottom: opt !== SORT_OPTIONS[SORT_OPTIONS.length - 1] ? '1px solid var(--cl-border)' : 'none' }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px var(--cl-px) 12px' }}>
            {coaches.map(co => {
              const initials = `${co.firstName[0]}${co.lastName[0]}`;
              return (
                <div key={co.id} onClick={() => history.push(`/athlete/coaches/${co.id}`)} style={{ display: 'flex', gap: 13, padding: 14, marginBottom: 11, borderRadius: 18, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', cursor: 'pointer' }}>
                  <div style={{
                    width: 62, height: 62, borderRadius: 16, flexShrink: 0,
                    backgroundImage: 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 9px, var(--cl-photo-dark-2) 9px 18px)',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
                  }}>
                    <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cl-accent)', padding: '6px 8px' }}>{initials}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{co.firstName} {co.lastName}</span>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--cl-ink)' }}>₦{co.sessionRate.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 3 }}>{co.sport} Coach · {co.yearsOfExperience} yrs exp</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--cl-ink)', background: 'var(--cl-subtle)', padding: '4px 9px', borderRadius: 7 }}>★ {co.rating}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--cl-muted-1)' }}>{co.venue}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CoachListingPage;
