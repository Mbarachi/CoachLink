import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppCard,
  AppPage,
  EmptyState,
  InitialsAvatar,
  PageBody,
  PageTitle,
  QueryState,
  RatingStar,
} from '@/components/ui';
import { useCoaches, useDebounced, useSports } from '@/hooks';
import { coachInitials, coachName, primarySport, venuesOf } from '@/lib/coach';
import { formatNaira } from '@/lib/format';

const ALL = 'All sports';

const Chip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <span
    onClick={onClick}
    style={{
      flexShrink: 0,
      background: active ? 'var(--cl-ink-fill)' : 'var(--cl-surface)',
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
  const [sport, setSport] = useState(ALL);
  const [venue, setVenue] = useState<string | null>(null);

  const search = useDebounced(query);
  const sports = useSports();
  const coaches = useCoaches({
    ...(sport !== ALL ? { sport } : {}),
    ...(venue ? { venue } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  });

  const results = coaches.data ?? [];
  // Venue chips come from an unfiltered read so choosing one doesn't collapse
  // the list of venues you can switch to.
  const allCoaches = useCoaches();
  const venues = useMemo(() => venuesOf(allCoaches.data ?? []), [allCoaches.data]);

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageTitle style={{ margin: '8px 0 12px' }}>Search</PageTitle>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 50, borderRadius: 15, background: 'var(--cl-surface)', border: '1.6px solid var(--cl-ink)', padding: '0 15px' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--cl-ink)' }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Coach name or venue"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 13, overflowX: 'auto', paddingBottom: 3 }}>
          <Chip label={ALL} active={sport === ALL} onClick={() => setSport(ALL)} />
          {(sports.data ?? []).map(s => (
            <Chip key={s.id} label={s.name} active={sport === s.name} onClick={() => setSport(s.name)} />
          ))}
        </div>

        {venues.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 9, overflowX: 'auto', paddingBottom: 3 }}>
            {venues.map(v => (
              <span
                key={v}
                onClick={() => setVenue(venue === v ? null : v)}
                style={{
                  flexShrink: 0,
                  background: venue === v ? 'var(--cl-ink-fill)' : 'var(--cl-subtle)',
                  color: venue === v ? 'var(--cl-accent)' : 'var(--cl-ink)',
                  fontWeight: 600, fontSize: 12.5, padding: '7px 14px',
                  borderRadius: 'var(--cl-radius-chip)', cursor: 'pointer',
                }}
              >{v}</span>
            ))}
          </div>
        )}
      </div>

      <PageBody refreshable style={{ paddingTop: 14 }}>
        <QueryState isLoading={coaches.isPending} error={coaches.error} onRetry={() => void coaches.refetch()}>
          {results.length === 0 ? (
            <EmptyState
              illustration="search"
              title="No coaches match that"
              message={
                query || sport !== ALL || venue
                  ? 'Try a different name, sport or venue.'
                  : 'No verified coaches are listed yet. Check back soon.'
              }
            />
          ) : (
            <>
              <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginBottom: 6 }}>
                {results.length} {results.length === 1 ? 'coach' : 'coaches'} near you
              </div>
              {results.map(co => (
                <AppCard
                  key={co.profile.id}
                  onClick={() => history.push(`/athlete/coaches/${co.profile.id}`)}
                  padding={13}
                  style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 10 }}
                >
                  <InitialsAvatar initials={coachInitials(co)} src={co.profileImage} size={50} radius={14} fontSize={16} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{coachName(co)}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>
                      {primarySport(co)} · {co.profile.venue}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{formatNaira(co.profile.sessionRate)}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>
                      {co.profile.totalReviews > 0
                        ? <><RatingStar /> {co.profile.rating.toFixed(1)}</>
                        : 'New'}
                    </div>
                  </div>
                </AppCard>
              ))}
            </>
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default SearchCoachesPage;
