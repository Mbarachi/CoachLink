import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  AppButton,
  AppCard,
  AppPage,
  BottomSheet,
  ChoiceChip,
  EmptyState,
  InitialsAvatar,
  PageBody,
  PageTitle,
  QueryState,
  RatingStar,
  sportBannerFor,
} from '@/components/ui';
import { useCoaches, useSports } from '@/hooks';
import { coachInitials, coachName, primarySport, venuesOf } from '@/lib/coach';
import {
  AGE_GROUP_OPTIONS, BUDGET_OPTIONS, LEVEL_OPTIONS, NEXT_SORT, NO_FILTERS, SORT_LABELS, WHEN_OPTIONS,
  ageGroupsTag, coachCount, levelsTag, matches, nextOpenLabel, sortCoaches,
  type CoachFilters, type SortKey,
} from '@/lib/coachSearch';
import { formatNaira } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';
import type { Coach } from '@/types';

/**
 * Every listed coach in one read, filtered on the phone — see coachSearch.ts.
 * Far above one neighbourhood's worth, so nobody is cut off the end.
 */
const DISCOVERY_LIMIT = 300;

const SPORT_FILL = {
  swimming: 'var(--cl-sport-swim)',
  tennis: 'var(--cl-sport-tennis)',
  default: 'var(--cl-ink-fill)',
} as const;

type FilterKey = 'ageGroup' | 'level' | 'when' | 'budget' | 'venue';

const PILLS: { key: FilterKey; short: string; title: string }[] = [
  { key: 'ageGroup', short: 'For', title: "Who's training" },
  { key: 'level', short: 'Level', title: 'Level' },
  { key: 'when', short: 'When', title: 'When' },
  { key: 'budget', short: 'Price', title: 'Price per session' },
  { key: 'venue', short: 'Venue', title: 'Venue' },
];

const FILTERS_OFF: Pick<CoachFilters, FilterKey> = {
  ageGroup: null, level: null, when: null, budget: null, venue: null,
};

const Magnifier: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cl-ink)" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" />
  </svg>
);

const CoachResult: React.FC<{ coach: Coach; onOpen: () => void }> = ({ coach, onOpen }) => {
  const p = coach.profile;
  const tags = [ageGroupsTag(p.ageGroups), levelsTag(p.levels)].filter(Boolean);
  const next = nextOpenLabel(coach);
  return (
    <AppCard onClick={onOpen} padding={13} style={{ display: 'flex', gap: 13, marginBottom: 10 }}>
      <InitialsAvatar initials={coachInitials(coach)} src={coach.profileImage} size={52} radius={14} fontSize={16} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* What and where first: a parent picking by need does not know the names yet. */}
        <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.25, color: 'var(--cl-ink)' }}>
          {primarySport(coach)} · {p.venue}
        </div>
        <div style={{ fontSize: 12, color: 'var(--cl-muted-1)', marginTop: 3 }}>
          {coachName(coach)} · {p.yearsOfExperience} yrs ·{' '}
          {p.totalReviews > 0
            ? <><RatingStar /> {p.rating.toFixed(1)} ({p.totalReviews})</>
            : 'New coach'}
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
            {tags.map(t => (
              <span key={t} style={{ fontSize: 11, fontWeight: 600, color: 'var(--cl-muted-3)', background: 'var(--cl-subtle)', padding: '4px 8px', borderRadius: 7 }}>{t}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--cl-border)' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: next ? 'var(--cl-accent)' : 'var(--cl-muted-2)', whiteSpace: 'nowrap' }}>
            {next ? `Next open · ${next}` : 'No times set this week'}
          </span>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--cl-ink)', flexShrink: 0 }}>{formatNaira(p.sessionRate)}</span>
        </div>
      </div>
    </AppCard>
  );
};

/**
 * Find a coach without knowing one by name. New parents and athletes don't,
 * so the screen leads with the sport and a row of filters, and keeps a name
 * search behind the magnifier for anyone a friend sent.
 */
const SearchCoachesPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const isParent = useAuthStore(s => s.user?.role === 'PARENT');

  // A parent is almost always booking for a child, so start there.
  const [filters, setFilters] = useState<CoachFilters>(() => ({
    ...NO_FILTERS, ageGroup: isParent ? 'CHILD' : null,
  }));
  const [sort, setSort] = useState<SortKey>('RATING');
  const [nameOpen, setNameOpen] = useState(false);
  const [sheet, setSheet] = useState<FilterKey | null>(null);
  const set = (patch: Partial<CoachFilters>) => setFilters(f => ({ ...f, ...patch }));

  // Home's cards open this tab with ?sport=Swimming. The tab stays mounted,
  // so it follows each visit rather than reading the address once; the key
  // makes the same card tapped twice still count.
  useEffect(() => {
    if (location.pathname !== '/athlete/search') return;
    const sport = new URLSearchParams(location.search).get('sport');
    if (sport) setFilters(f => ({ ...f, sport, venue: null, name: '' }));
  }, [location.pathname, location.search, location.key]);

  const sports = useSports().data ?? [];
  const query = useCoaches({ limit: DISCOVERY_LIMIT });
  const all = useMemo(() => query.data ?? [], [query.data]);

  const results = useMemo(() => sortCoaches(all.filter(c => matches(c, filters)), sort), [all, filters, sort]);
  /** How many a change would leave, ignoring any typed name. */
  const countWith = (patch: Partial<CoachFilters>) =>
    all.filter(c => matches(c, { ...filters, name: '', ...patch })).length;

  const venues = useMemo(
    () => venuesOf(filters.sport ? all.filter(c => c.sports.some(s => s.name === filters.sport)) : all),
    [all, filters.sport],
  );
  const optionsFor = (key: FilterKey): { value: string; label: string }[] => ({
    ageGroup: AGE_GROUP_OPTIONS,
    level: LEVEL_OPTIONS,
    when: WHEN_OPTIONS,
    budget: BUDGET_OPTIONS,
    venue: venues.map(v => ({ value: v, label: v })),
  })[key];
  const labelOf = (key: FilterKey) =>
    optionsFor(key).find(o => o.value === filters[key])?.label ?? filters[key];

  const name = filters.name.trim();
  const anyFilter = Object.keys(FILTERS_OFF).some(k => filters[k as FilterKey]);
  const sheetMeta = PILLS.find(p => p.key === sheet);
  const sheetCount = countWith({});

  const closeName = () => { setNameOpen(false); set({ name: '' }); };

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '4px 0 0' }}>
          <PageTitle style={{ margin: 0 }}>Find a coach</PageTitle>
          <button
            aria-label="Search by coach's name"
            onClick={() => (nameOpen ? closeName() : setNameOpen(true))}
            style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0 }}
          >
            <Magnifier />
          </button>
        </div>

        {nameOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, borderRadius: 15, background: 'var(--cl-surface)', border: '1.6px solid var(--cl-ink)', padding: '0 14px', marginTop: 12 }}>
            <Magnifier />
            <input
              autoFocus
              value={filters.name}
              onChange={e => set({ name: e.target.value })}
              placeholder="Coach's name"
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none', fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)' }}
            />
            <span onClick={closeName} style={{ fontWeight: 700, fontSize: 13, color: 'var(--cl-accent)', cursor: 'pointer', flexShrink: 0 }}>Cancel</span>
          </div>
        )}

        {/* A typed name sets these aside, so they fade rather than look applied. */}
        <div style={{ opacity: name ? 0.45 : 1, transition: 'opacity .2s' }}>
        {/* Two sports, so two big buttons beat a row of chips. Tapping the
            chosen one again goes back to both. */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(sports.length, 1)}, 1fr)`, gap: 10, marginTop: 14 }}>
          {sports.map(s => {
            const on = filters.sport === s.name;
            const fill = SPORT_FILL[sportBannerFor(s.name)];
            return (
              <div
                key={s.id}
                onClick={() => set({ sport: on ? null : s.name, venue: null })}
                style={{ position: 'relative', height: 76, borderRadius: 18, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', background: on ? fill : 'var(--cl-surface)', border: `1.6px solid ${on ? fill : 'var(--cl-border)'}` }}
              >
                <span style={{ position: 'absolute', right: 13, top: 13, width: 12, height: 12, borderRadius: '50%', background: on ? 'var(--cl-on-ink)' : fill }} />
                <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 18, color: on ? 'var(--cl-on-ink)' : 'var(--cl-ink)' }}>{s.name}</span>
                <span style={{ fontSize: 11.5, color: on ? 'var(--cl-on-ink)' : 'var(--cl-muted-1)', opacity: on ? 0.8 : 1 }}>
                  {query.data ? coachCount(countWith({ sport: s.name, venue: null })) : ' '}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '14px calc(-1 * var(--cl-px)) 0', padding: '0 var(--cl-px) 2px', scrollbarWidth: 'none' }}>
          {PILLS.map(({ key, short }) => {
            const on = Boolean(filters[key]);
            return (
              <span
                key={key}
                onClick={() => setSheet(key)}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 14px', borderRadius: 'var(--cl-radius-chip)', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer', background: on ? 'var(--cl-ink-fill)' : 'var(--cl-surface)', color: on ? 'var(--cl-on-ink)' : 'var(--cl-ink)', border: on ? '1px solid var(--cl-ink-fill)' : '1px solid var(--cl-border)' }}
              >
                {on ? `${short}: ${labelOf(key)}` : short}
                <span style={{ fontSize: 10, opacity: 0.7 }}>▾</span>
              </span>
            );
          })}
        </div>
        </div>
      </div>

      <PageBody refreshable style={{ paddingTop: 14 }}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {all.length === 0 ? (
            <EmptyState
              illustration="coaches"
              title="No coaches listed yet"
              message="Coaches appear here once they've been verified. Check back soon."
            />
          ) : results.length === 0 ? (
            <EmptyState
              illustration="search"
              title={name ? 'No coach by that name' : 'No coach fits all of that'}
              message={name
                ? 'Check the spelling, or clear the name and use the filters instead.'
                : 'Try another day or price, or clear a filter.'}
              action={(name || anyFilter) ? (
                <AppButton
                  size="md"
                  variant="outline"
                  fullWidth={false}
                  onClick={() => (name ? closeName() : set(FILTERS_OFF))}
                >
                  {name ? 'Clear name' : 'Clear filters'}
                </AppButton>
              ) : undefined}
            />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>
                  {coachCount(results.length)} {name ? `named “${name}”` : 'found'}
                </span>
                <span onClick={() => setSort(NEXT_SORT[sort])} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cl-ink)', cursor: 'pointer' }}>
                  Sort: {SORT_LABELS[sort]} ↕
                </span>
              </div>
              {results.map(co => (
                <CoachResult key={co.profile.id} coach={co} onOpen={() => history.push(`/athlete/coaches/${co.profile.id}`)} />
              ))}
            </>
          )}
        </QueryState>
      </PageBody>

      <BottomSheet
        open={sheet !== null}
        title={sheetMeta?.title ?? ''}
        onClose={() => setSheet(null)}
        action={sheet ? { label: 'Clear', onClick: () => set({ [sheet]: null }) } : undefined}
        footer={
          <AppButton size="md" onClick={() => setSheet(null)}>
            {sheetCount ? `Show ${coachCount(sheetCount)}` : 'No coaches match'}
          </AppButton>
        }
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sheet && optionsFor(sheet).map(o => (
            <ChoiceChip
              key={o.value}
              active={filters[sheet] === o.value}
              onClick={() => set({ [sheet]: filters[sheet] === o.value ? null : o.value })}
              style={{ padding: '10px 16px', fontSize: 13.5 }}
            >
              {o.label}
            </ChoiceChip>
          ))}
        </div>
      </BottomSheet>
    </AppPage>
  );
};

export default SearchCoachesPage;
