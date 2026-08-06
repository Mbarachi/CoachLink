import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  /** Selected cards take the ink border treatment used by pickers. */
  selected?: boolean;
  padding?: React.CSSProperties['padding'];
  style?: React.CSSProperties;
}

const AppCard: React.FC<AppCardProps> = ({
  children, onClick, selected = false, padding = 16, style,
}) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--cl-surface)',
      border: selected ? '1.6px solid var(--cl-ink)' : '1px solid var(--cl-border)',
      borderRadius: 'var(--cl-radius-card)',
      padding,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
  >
    {children}
  </div>
);

export default AppCard;
