import React from 'react';

interface ToggleProps {
  on: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ on, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 42, height: 24, borderRadius: 'var(--cl-radius-chip)',
      background: on ? 'var(--cl-accent)' : 'var(--cl-border)',
      position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .15s',
    }}
  >
    <div style={{
      position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20,
      borderRadius: '50%', background: 'var(--cl-on-ink)', transition: 'left .15s',
    }} />
  </div>
);

export default Toggle;
