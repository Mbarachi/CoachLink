import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppCard, AppPage, EmptyState, PageBody, PageHeader, PhotoTile, QueryState, RatingStar,
} from '@/components/ui';
import { useCoaches } from '@/hooks';
import { coachInitials, coachName, primarySport } from '@/lib/coach';
import { formatNaira } from '@/lib/format';
import type { Coach } from '@/types';

type SortKey = 'Highest Rated' | 'Lowest Price' | 'Most Experienced';
const SORT_OPTIONS: SortKey[] = ['Highest Rated', 'Lowest Price', 'Most Experienced'];

function sorted(coaches: Coach[], key: SortKey) {
  return [...coaches].sort((a, b) => {
    if (key === 'Highest Rated') return b.profile.rating - a.profile.rating;
    if (key === 'Lowest Price') return a.profile.sessionRate - b.profile.sessionRate;
    if (key === 'Most Experienced') return b.profile.yearsOfExperience - a.profile.yearsOfExperience;
    return 0;
  });
}

const CoachListingPage: React.FC = () => {
  const history = useHistory();
  const [sortKey, setSortKey] = useState<SortKey>('Highest Rated');
  const [showSort, setShowSort] = useState(false);

  const query = useCoaches();
  const coaches = useMemo(() => sorted(query.data ?? [], sortKey), [query.data, sortKey]);
  const area = coaches[0]?.profile.area ?? 'Amuwo Odofin';

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Coaches near you" style={{ padding: '4px 0 12px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <span style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
            {coaches.length} {coaches.length === 1 ? 'result' : 'results'} · {area}
          </span>

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

      <PageBody refreshable style={{ paddingTop: 14 }}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {coaches.length === 0 ? (
            <EmptyState
              illustration="coaches"
              title="No coaches listed yet"
              message="Coaches appear here once they've been verified. Check back soon."
            />
          ) : (
            coaches.map(co => (
              <AppCard
                key={co.profile.id}
                onClick={() => history.push(`/athlete/coaches/${co.profile.id}`)}
                padding={14}
                style={{ display: 'flex', gap: 13, marginBottom: 11 }}
              >
                <PhotoTile initials={coachInitials(co)} src={co.profileImage} size={62} radius={16} fontSize={15} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{coachName(co)}</span>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--cl-ink)' }}>{formatNaira(co.profile.sessionRate)}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 3 }}>
                    {primarySport(co)} Coach · {co.profile.yearsOfExperience} yrs exp
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--cl-ink)', background: 'var(--cl-subtle)', padding: '4px 9px', borderRadius: 7 }}>
                      {co.profile.totalReviews > 0
                        ? <><RatingStar /> {co.profile.rating.toFixed(1)}</>
                        : 'New coach'}
                    </span>
                    <span style={{ fontSize: 11.5, color: 'var(--cl-muted-1)' }}>{co.profile.venue}</span>
                  </div>
                </div>
              </AppCard>
            ))
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default CoachListingPage;
