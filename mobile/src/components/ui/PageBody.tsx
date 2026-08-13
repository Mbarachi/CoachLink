import React from 'react';

interface PageBodyProps {
  children: React.ReactNode;
  /** Bottom padding — raise it on pages with a sticky footer or tab bar. */
  pb?: number;
  style?: React.CSSProperties;
}

/** Scrollable middle region between a fixed header and an optional sticky footer. */
const PageBody: React.FC<PageBodyProps> = ({ children, pb = 12, style }) => (
  <div style={{ flex: 1, overflowY: 'auto', paddingBottom: pb, ...style }}>
    {children}
  </div>
);

export default PageBody;
