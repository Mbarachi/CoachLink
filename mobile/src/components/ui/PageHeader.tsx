import React from 'react';

import BackButton from './BackButton';

interface PageHeaderProps {
  title?: string;
  onBack?: () => void;
  /** Custom middle slot, for headers that show more than a plain title. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, children, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '4px 0 14px', flexShrink: 0, ...style }}>
    <BackButton onClick={onBack} />
    {children ?? (
      <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>
        {title}
      </span>
    )}
  </div>
);

export default PageHeader;
