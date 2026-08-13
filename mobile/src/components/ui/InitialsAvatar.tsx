import React from 'react';

type Tone = 'ink' | 'subtle';

const TONES: Record<Tone, React.CSSProperties> = {
  ink: { background: 'var(--cl-ink)', color: 'var(--cl-accent)' },
  subtle: { background: 'var(--cl-subtle)', color: 'var(--cl-ink)' },
};

interface InitialsAvatarProps {
  initials: string;
  size?: number;
  tone?: Tone;
  /** Both default to a ratio of `size`; override when a screen needs a specific value. */
  radius?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  initials, size = 46, tone = 'ink', radius, fontSize, style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: radius ?? Math.round(size * 0.28),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--cl-font-display)',
      fontWeight: 700,
      fontSize: fontSize ?? Math.round(size * 0.32),
      flexShrink: 0,
      ...TONES[tone],
      ...style,
    }}
  >
    {initials}
  </div>
);

export default InitialsAvatar;
