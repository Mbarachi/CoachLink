import type React from 'react';

/**
 * fontSize 16 is deliberate: anything smaller makes mobile Safari auto-zoom
 * when the field receives focus.
 */
export const fieldStyle: React.CSSProperties = {
  width: '100%',
  height: 52,
  borderRadius: 'var(--cl-radius-input)',
  border: '1px solid var(--cl-border)',
  background: 'var(--cl-surface)',
  padding: '0 15px',
  fontFamily: 'var(--cl-font-body)',
  fontSize: 16,
  color: 'var(--cl-ink)',
  outline: 'none',
  boxSizing: 'border-box',
};
