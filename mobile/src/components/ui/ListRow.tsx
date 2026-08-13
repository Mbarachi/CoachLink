import React from 'react';

interface ListRowProps {
  label: string;
  onClick?: () => void;
  /** Replaces the default chevron — a toggle, a value + chevron, etc. */
  right?: React.ReactNode;
  last?: boolean;
}

/** Full-bleed row for the grouped lists on the Settings/Profile screens. */
const ListRow: React.FC<ListRowProps> = ({ label, onClick, right, last }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', padding: '14px 15px',
      borderBottom: last ? 'none' : '1px solid var(--cl-subtle)',
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cl-ink)' }}>{label}</span>
    {right ?? <span style={{ color: 'var(--cl-muted-line)' }}>›</span>}
  </div>
);

export default ListRow;
