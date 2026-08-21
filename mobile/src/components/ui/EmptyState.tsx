import React from 'react';

import EmptyIllustration from './EmptyIllustration';
import type { IllustrationName } from './EmptyIllustration';

interface EmptyStateProps {
  illustration: IllustrationName;
  title: string;
  message?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ illustration, title, message, action, compact }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: compact ? '28px 20px' : '52px 24px',
    }}
  >
    <EmptyIllustration name={illustration} size={compact ? 88 : 120} />
    <h3
      style={{
        fontFamily: 'var(--cl-font-display)',
        fontWeight: 700,
        fontSize: compact ? 16 : 18,
        color: 'var(--cl-ink)',
        margin: '16px 0 0',
      }}
    >
      {title}
    </h3>
    {message && (
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.55,
          color: 'var(--cl-muted-1)',
          margin: '7px 0 0',
          maxWidth: 280,
        }}
      >
        {message}
      </p>
    )}
    {action && <div style={{ marginTop: 20 }}>{action}</div>}
  </div>
);

export default EmptyState;
