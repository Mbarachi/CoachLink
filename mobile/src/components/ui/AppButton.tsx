import React from 'react';

import Spinner from './Spinner';

type Variant = 'primary' | 'ink' | 'outline' | 'destructive' | 'text';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, React.CSSProperties> = {
  primary: { border: 'none', background: 'var(--cl-accent)', color: 'var(--cl-on-accent)' },
  ink: { border: 'none', background: 'var(--cl-ink-fill)', color: 'var(--cl-on-ink)' },
  outline: { border: '1.6px solid var(--cl-ink)', background: 'var(--cl-surface)', color: 'var(--cl-ink)' },
  destructive: { border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', color: 'var(--cl-destructive)' },
  text: { border: 'none', background: 'none', color: 'var(--cl-ink)' },
};

const SIZES: Record<Size, React.CSSProperties> = {
  md: { height: 54, fontSize: 15.5 },
  lg: { height: 56, fontSize: 16 },
};

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  /**
   * Shows a spinner and blocks the press. Separate from `disabled` so the
   * button reads as busy rather than unavailable — and so a double-tap on a
   * slow connection cannot fire the action twice, which every screen was
   * otherwise left to remember on its own.
   */
  loading?: boolean;
  /** Replaces the label while loading. Without it the label stays put. */
  loadingLabel?: string;
  style?: React.CSSProperties;
}

const AppButton: React.FC<AppButtonProps> = ({
  children, onClick, variant = 'primary', size = 'lg', disabled = false, fullWidth = true,
  loading = false, loadingLabel, style,
}) => {
  const isText = variant === 'text';
  const blocked = disabled || loading;

  // Contrast against the button's own fill, so the spinner is visible on the
  // accent and ink variants as well as the light ones.
  const spinnerColor = variant === 'primary' || variant === 'ink'
    ? 'var(--cl-surface)'
    : 'var(--cl-accent)';

  return (
    <button
      onClick={blocked ? undefined : onClick}
      disabled={blocked}
      style={{
        ...(isText
          ? { fontSize: 14, fontWeight: 600 }
          : { ...SIZES[size], borderRadius: 'var(--cl-radius-btn)', fontWeight: 700 }),
        ...VARIANTS[variant],
        width: fullWidth && !isText ? '100%' : undefined,
        fontFamily: 'var(--cl-font-body)',
        cursor: blocked ? 'default' : 'pointer',
        // A loading button is working, not unavailable, so it stays legible.
        opacity: disabled && !loading ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        ...style,
      }}
    >
      {loading && (
        <Spinner
          size={isText ? 14 : 17}
          color={spinnerColor}
          track={variant === 'primary' || variant === 'ink' ? 'rgba(255,255,255,.35)' : 'var(--cl-border-alt)'}
        />
      )}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
};

export default AppButton;
