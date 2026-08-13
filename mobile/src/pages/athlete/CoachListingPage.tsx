import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, PageBody, PageHeader, PhotoTile, StatusBar } from '@/components/ui';
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
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageHeader title="Coaches near you" style={{ padding: '4px 0 12px' }} />

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

      <PageBody style={{ paddingTop: 14 }}>
        {coaches.map(co => (
          <AppCard
            key={co.id}
            onClick={() => history.push(`/athlete/coaches/${co.id}`)}
            padding={14}
            style={{ display: 'flex', gap: 13, marginBottom: 11 }}
          >
            <PhotoTile initials={`${co.firstName[0]}${co.lastName[0]}`} size={62} radius={16} fontSize={15} />
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
          </AppCard>
        ))}
      </PageBody>
    </AppPage>
  );
};

export default CoachListingPage;
