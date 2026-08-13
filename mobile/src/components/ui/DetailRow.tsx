import React from 'react';

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  /** Emphasises the value — used for the fee/total row. */
  bold?: boolean;
  /** Drops the divider on the final row of a card. */
  last?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, bold, last }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', padding: '13px 0',
    borderBottom: last ? 'none' : '1px solid var(--cl-subtle)',
  }}>
    <span style={{ fontSize: 13.5, color: 'var(--cl-muted-1)' }}>{label}</span>
    <span style={{ fontSize: 13.5, fontWeight: bold ? 700 : 600, color: 'var(--cl-ink)' }}>{value}</span>
  </div>
);

export default DetailRow;
