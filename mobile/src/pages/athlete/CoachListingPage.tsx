import { IonContent, IonPage } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { CoachCard } from '@/features/coaches/components';
import { mockCoaches } from '@/features/coaches/data/mockCoaches';

type SortKey = 'rating' | 'price' | 'experience';

const SORT_OPTIONS: { label: string; key: SortKey }[] = [
  { label: 'Highest Rated', key: 'rating' },
  { label: 'Lowest Price', key: 'price' },
  { label: 'Most Experienced', key: 'experience' },
];

const sortChip = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 14px',
  borderRadius: 20,
  fontFamily: 'Poppins, sans-serif',
  fontSize: 12,
  fontWeight: active ? 600 : 400,
  background: active ? 'var(--cl-primary)' : '#fff',
  color: active ? '#fff' : 'var(--cl-text-light)',
  border: `1.5px solid ${active ? 'var(--cl-primary)' : 'var(--cl-border)'}`,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: 'all 0.15s',
});

const CoachListingPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [sortKey, setSortKey] = useState<SortKey>('rating');

  const params = new URLSearchParams(location.search);
  const sportFilter = params.get('sport') ?? '';
  const venueFilter = params.get('venue') ?? '';
  const queryFilter = (params.get('query') ?? '').toLowerCase();

  const filtered = useMemo(() => {
    let list = [...mockCoaches];

    if (sportFilter) list = list.filter((c) => c.sport === sportFilter);
    if (venueFilter) list = list.filter((c) => c.venue === venueFilter);
    if (queryFilter) list = list.filter((c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(queryFilter));

    switch (sortKey) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        list.sort((a, b) => a.sessionRate - b.sessionRate);
        break;
      case 'experience':
        list.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
        break;
    }

    return list;
  }, [sportFilter, venueFilter, queryFilter, sortKey]);

  const subtitle = [sportFilter, venueFilter].filter(Boolean).join(' · ') || 'All Coaches';

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div style={{ padding: '56px 24px 100px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <button
              onClick={() => history.goBack()}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IonIcon
                icon={arrowBackOutline}
                style={{ fontSize: 22, color: 'var(--cl-text-main)' }}
              />
            </button>
            <div>
              <h2
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: 20,
                  color: 'var(--cl-text-main)',
                  margin: 0,
                }}
              >
                Coaches
              </h2>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 12,
                  color: 'var(--cl-text-light)',
                  margin: 0,
                }}
              >
                {subtitle} · {filtered.length} found
              </p>
            </div>
          </div>

          {/* Sort chips */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              margin: '16px 0 20px',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                style={sortChip(sortKey === opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Coach cards */}
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 0',
              }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 15,
                  color: 'var(--cl-text-light)',
                }}
              >
                No coaches found for your filters.
              </p>
              <button
                onClick={() => history.push('/athlete/search')}
                style={{
                  marginTop: 12,
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 14,
                  color: 'var(--cl-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Adjust Filters
              </button>
            </div>
          ) : (
            filtered.map((coach) => <CoachCard key={coach.id} coach={coach} />)
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CoachListingPage;
