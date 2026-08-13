import React from 'react';

interface StickyFooterProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** Pinned action bar at the bottom of a fixed-height page. */
const StickyFooter: React.FC<StickyFooterProps> = ({ children, style }) => (
  <div style={{
    flexShrink: 0,
    padding: '14px var(--cl-px) 22px',
    background: 'var(--cl-canvas)',
    borderTop: '1px solid var(--cl-border)',
    ...style,
  }}>
    {children}
  </div>
);

export default StickyFooter;
