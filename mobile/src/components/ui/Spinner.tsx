import React from 'react';

interface SpinnerProps {
  size?: number;
  /** Ring colour. Defaults to the accent; pass currentColor to inherit. */
  color?: string;
  /** The faint remainder of the ring. */
  track?: string;
  style?: React.CSSProperties;
}

/**
 * The one spinner. Its keyframes live in variables.css rather than a <style>
 * tag here, so a page rendering several of these does not inject the same
 * animation repeatedly.
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 18,
  color = 'var(--cl-accent)',
  track = 'var(--cl-border-alt)',
  style,
}) => (
  <span
    role="progressbar"
    aria-label="Loading"
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      border: `${Math.max(2, Math.round(size / 9))}px solid ${track}`,
      borderTopColor: color,
      animation: 'cl-spin 0.7s linear infinite',
      flexShrink: 0,
      ...style,
    }}
  />
);

export default Spinner;
