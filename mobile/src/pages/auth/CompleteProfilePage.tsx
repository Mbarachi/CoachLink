import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppPage, BackButton, FormLabel, QueryState } from '@/components/ui';
import { useSports } from '@/hooks';

const CompleteProfilePage: React.FC = () => {
  const history = useHistory();
  const sportsQuery = useSports();
  const sports = sportsQuery.data ?? [];

  const [sport, setSport] = useState<string | null>(null);
  const chosen = sport ?? sports[0]?.name ?? null;

  const finish = () => history.replace('/athlete/home');

  return (
    <AppPage scrollable padding="auth">
      <BackButton size={40} style={{ marginTop: 6 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '22px 0 6px' }}>
        What are you<br />training for?
      </h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '0 0 22px' }}>
        Helps us show you the right coaches first. You can change this anytime.
      </p>

      {/* Wrapped so a failed sports read shows itself. Previously this silently
          rendered nothing, leaving the screen with only a location field. */}
      <QueryState
        isLoading={sportsQuery.isPending}
        error={sportsQuery.error}
        onRetry={() => void sportsQuery.refetch()}
        loadingLabel="Loading sports…"
      >
        <div style={{ display: 'flex', gap: 10 }}>
          {sports.map((s) => {
            const active = chosen === s.name;
            return (
              <div
                key={s.id}
                onClick={() => setSport(s.name)}
                style={{
                  flex: 1,
                  background: active ? 'var(--cl-ink)' : 'var(--cl-surface)',
                  border: active ? 'none' : '1px solid var(--cl-border)',
                  borderRadius: 18,
                  padding: 16,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: active ? 'var(--cl-surface)' : 'var(--cl-ink)', marginTop: 8 }}>{s.name}</div>
              </div>
            );
          })}
        </div>
      </QueryState>

      <FormLabel style={{ margin: '22px 0 7px' }}>Your location</FormLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52, borderRadius: 'var(--cl-radius-input)', background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', padding: '0 15px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cl-accent)', flexShrink: 0 }} />
        <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cl-ink)' }}>Amuwo Odofin, Lagos</span>
      </div>

      <AppButton onClick={finish} disabled={!chosen} style={{ marginTop: 24 }}>Continue</AppButton>
    </AppPage>
  );
};

export default CompleteProfilePage;
