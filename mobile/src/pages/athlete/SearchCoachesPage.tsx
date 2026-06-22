import { IonContent, IonPage } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton } from '@/components/ui';
import { SPORTS, VENUES } from '@/features/coaches/data/mockCoaches';

const ALL = 'All';

const chipStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '7px 16px',
  borderRadius: 20,
  fontFamily: 'Poppins, sans-serif',
  fontSize: 13,
  fontWeight: active ? 600 : 400,
  background: active ? 'var(--cl-primary)' : '#fff',
  color: active ? '#fff' : 'var(--cl-text-light)',
  border: `1.5px solid ${active ? 'var(--cl-primary)' : 'var(--cl-border)'}`,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s',
  flexShrink: 0,
});

const SearchCoachesPage: React.FC = () => {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState(ALL);
  const [venue, setVenue] = useState(ALL);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    if (sport !== ALL) params.set('sport', sport);
    if (venue !== ALL) params.set('venue', venue);
    history.push(`/athlete/coaches?${params.toString()}`);
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div style={{ padding: '56px 24px 100px' }}>
          {/* Header */}
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--cl-text-main)',
              margin: '0 0 4px',
            }}
          >
            Find a Coach
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              color: 'var(--cl-text-light)',
              margin: '0 0 24px',
            }}
          >
            Amuwo Odofin, Lagos
          </p>

          {/* Search input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              border: '1.5px solid var(--cl-border)',
              borderRadius: 12,
              padding: '0 14px',
              marginBottom: 24,
              minHeight: 52,
            }}
          >
            <IonIcon
              icon={searchOutline}
              style={{ fontSize: 18, color: 'var(--cl-text-light)', marginRight: 10, flexShrink: 0 }}
            />
            <input
              type="text"
              placeholder="Search by coach name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 15,
                color: 'var(--cl-text-main)',
              }}
            />
          </div>

          {/* Sport filter */}
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--cl-text-main)',
              margin: '0 0 10px',
            }}
          >
            Sport
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 20,
            }}
          >
            {[ALL, ...SPORTS].map((s) => (
              <button key={s} onClick={() => setSport(s)} style={chipStyle(sport === s)}>
                {s}
              </button>
            ))}
          </div>

          {/* Venue filter */}
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--cl-text-main)',
              margin: '0 0 10px',
            }}
          >
            Venue
          </p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 32,
            }}
          >
            {[ALL, ...VENUES].map((v) => (
              <button key={v} onClick={() => setVenue(v)} style={chipStyle(venue === v)}>
                {v}
              </button>
            ))}
          </div>

          <AppButton onClick={handleSearch}>Search Coaches</AppButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SearchCoachesPage;
