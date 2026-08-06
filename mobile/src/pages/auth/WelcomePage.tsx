import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppPage, StatusBar } from '@/components/ui';

const WelcomePage: React.FC = () => {
  const history = useHistory();

  return (
    <AppPage padding="auth">
      <StatusBar />

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, background: 'var(--cl-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--cl-accent)' }} />
        </div>
        <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 20, color: 'var(--cl-ink)', letterSpacing: '-0.03em' }}>CoachLink</span>
      </div>

      <div style={{
        marginTop: 22, borderRadius: 26, height: 316, flexShrink: 0,
        backgroundImage: 'repeating-linear-gradient(125deg, #E7D7C2 0 13px, #EFE3D3 13px 26px)',
        border: '1px solid var(--cl-border)',
        display: 'flex', alignItems: 'flex-end', padding: 16, overflow: 'hidden',
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--cl-muted-2)', background: 'var(--cl-surface)', padding: '4px 9px', borderRadius: 7 }}>
          athlete · hero photo
        </span>
      </div>

      <div style={{ flex: 1 }} />

      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 37, lineHeight: 1.02, letterSpacing: '-0.035em', color: 'var(--cl-ink)', margin: '18px 0 0' }}>
        Find your coach.<br />Train with intent.
      </h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '13px 0 0' }}>
        Verified swimming &amp; tennis coaches in Amuwo Odofin. Book by the session, train near home.
      </p>

      <AppButton onClick={() => history.push('/auth/signup')} style={{ marginTop: 20 }}>
        Create an account
      </AppButton>
      <AppButton variant="text" onClick={() => history.push('/auth/signin')} style={{ margin: '11px 0 22px' }}>
        I already have an account
      </AppButton>
    </AppPage>
  );
};

export default WelcomePage;
