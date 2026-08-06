import React from 'react';

interface SectionHeadingProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ children, style }) => (
  <h4 style={{
    fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14,
    color: 'var(--cl-ink)', margin: '20px 0 11px', ...style,
  }}>
    {children}
  </h4>
);

export default SectionHeading;
