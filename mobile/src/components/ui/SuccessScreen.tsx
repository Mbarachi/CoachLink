import React from 'react';

import AppPage from './AppPage';

interface SuccessScreenProps {
  title: string;
  message: React.ReactNode;
  /** Action buttons rendered below the message. */
  children?: React.ReactNode;
}

/** Centred confirmation screen: accent check mark, headline, message, actions. */
const SuccessScreen: React.FC<SuccessScreenProps> = ({ title, message, children }) => (
  <AppPage padding="hero" center>
    <div style={{
      width: 96, height: 96, borderRadius: '50%', background: 'var(--cl-accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 44, color: 'var(--cl-on-accent)',
    }}>✓</div>

    <h2 style={{
      fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 27,
      letterSpacing: '-0.02em', color: 'var(--cl-ink)', margin: '26px 0 10px',
    }}>{title}</h2>

    <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: 0 }}>{message}</p>

    {children}
  </AppPage>
);

export default SuccessScreen;
