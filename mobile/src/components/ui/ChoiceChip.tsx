import React from 'react';

interface ChoiceChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/** Selectable pill used by sport pickers, time slots and filters. */
const ChoiceChip: React.FC<ChoiceChipProps> = ({ children, active = false, onClick, style }) => (
  <span
    onClick={onClick}
    style={{
      fontSize: 13, fontWeight: 600, padding: '9px 15px', borderRadius: 11,
      cursor: onClick ? 'pointer' : 'default',
      background: active ? 'var(--cl-ink-fill)' : 'var(--cl-surface)',
      color: active ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
      border: active ? 'none' : '1px solid var(--cl-border)',
      ...style,
    }}
  >
    {children}
  </span>
);

export default ChoiceChip;
