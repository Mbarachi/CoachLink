import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, InitialsAvatar, PageBody, PageTitle, StatusBar } from '@/components/ui';
import { mockCoaches, VENUES, SPORTS } from '@/features/coaches/data/mockCoaches';

const ALL_SPORTS = ['All sports', ...SPORTS];

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

  const results = mockCoaches.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesSport = sport === 'All sports' || c.sport === sport;
    const matchesQuery = fullName.includes(query.toLowerCase()) || c.venue.toLowerCase().includes(query.toLowerCase());
    return matchesSport && matchesQuery;
  });

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageTitle style={{ margin: '8px 0 12px' }}>Search</PageTitle>

        {/* search box */}
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

        {/* sport chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 13, overflowX: 'auto', paddingBottom: 3 }}>
          {ALL_SPORTS.map(s => <Chip key={s} label={s} active={sport === s} onClick={() => setSport(s)} />)}
        </div>

        {/* venue chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 9, overflowX: 'auto', paddingBottom: 3 }}>
          {VENUES.map(v => (
            <span key={v} style={{ flexShrink: 0, background: 'var(--cl-subtle)', color: 'var(--cl-ink)', fontWeight: 600, fontSize: 12.5, padding: '7px 14px', borderRadius: 'var(--cl-radius-chip)', cursor: 'pointer' }}>{v}</span>
          ))}
        </div>
      </div>

      {/* results */}
      <PageBody style={{ paddingTop: 14 }}>
        <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginBottom: 6 }}>{results.length} coaches near you</div>
        {results.map(co => (
          <AppCard
            key={co.id}
            onClick={() => history.push(`/athlete/coaches/${co.id}`)}
            padding={13}
            style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 10 }}
          >
            <InitialsAvatar initials={`${co.firstName[0]}${co.lastName[0]}`} size={50} radius={14} fontSize={16} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{co.firstName} {co.lastName}</div>
              <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>{co.sport} · {co.venue}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>₦{co.sessionRate.toLocaleString()}</div>
              <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>★ {co.rating}</div>
            </div>
          </AppCard>
        ))}
      </PageBody>
    </AppPage>
  );
};

export default SearchCoachesPage;
