import React from 'react';

type Variant = 'primary' | 'ink' | 'outline' | 'destructive' | 'text';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, React.CSSProperties> = {
  primary: { border: 'none', background: 'var(--cl-accent)', color: 'var(--cl-on-accent)' },
  ink: { border: 'none', background: 'var(--cl-ink)', color: 'var(--cl-surface)' },
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
  style?: React.CSSProperties;
}

const AppButton: React.FC<AppButtonProps> = ({
  children, onClick, variant = 'primary', size = 'lg', disabled = false, fullWidth = true, style,
}) => {
  const isText = variant === 'text';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...(isText
          ? { fontSize: 14, fontWeight: 600 }
          : { ...SIZES[size], borderRadius: 'var(--cl-radius-btn)', fontWeight: 700 }),
        ...VARIANTS[variant],
        width: fullWidth && !isText ? '100%' : undefined,
        fontFamily: 'var(--cl-font-body)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default AppButton;
