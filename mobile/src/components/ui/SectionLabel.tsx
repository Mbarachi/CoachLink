import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** Small uppercase monospace label above a grouped list. */
const SectionLabel: React.FC<SectionLabelProps> = ({ children, style }) => (
  <div style={{
    fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em',
    color: 'var(--cl-muted-2)', margin: '6px 0 8px', ...style,
  }}>
    {children}
  </div>
);

export default SectionLabel;
