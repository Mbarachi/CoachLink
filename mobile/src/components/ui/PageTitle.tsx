import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/** Large screen title used by the tab-root pages. */
const PageTitle: React.FC<PageTitleProps> = ({ children, style }) => (
  <h1 style={{
    fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26,
    letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 14px', ...style,
  }}>
    {children}
  </h1>
);

export default PageTitle;
