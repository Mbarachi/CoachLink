import React from 'react';

interface TabChipsProps {
  tabs: readonly string[];
  /** Index of the active tab. */
  active: number;
  onChange: (index: number) => void;
  style?: React.CSSProperties;
}

const TabChips: React.FC<TabChipsProps> = ({ tabs, active, onChange, style }) => (
  <div style={{ display: 'flex', gap: 8, ...style }}>
    {tabs.map((t, i) => (
      <span
        key={t}
        onClick={() => onChange(i)}
        style={{
          background: active === i ? 'var(--cl-ink)' : 'var(--cl-surface)',
          color: active === i ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
          border: active === i ? 'none' : '1px solid var(--cl-border)',
          fontWeight: 600, fontSize: 13, padding: '8px 16px',
          borderRadius: 'var(--cl-radius-chip)', cursor: 'pointer',
        }}
      >{t}</span>
    ))}
  </div>
);

export default TabChips;
