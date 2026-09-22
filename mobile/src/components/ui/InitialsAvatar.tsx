import React, { useState } from 'react';

type Tone = 'ink' | 'subtle';

const TONES: Record<Tone, React.CSSProperties> = {
  ink: { background: 'var(--cl-ink-fill)', color: 'var(--cl-accent)' },
  subtle: { background: 'var(--cl-subtle)', color: 'var(--cl-ink)' },
};

interface InitialsAvatarProps {
  initials: string;
  /** A real photo when the person has uploaded one; initials remain the fallback. */
  src?: string | null;
  size?: number;
  tone?: Tone;
  /** Both default to a ratio of `size`; override when a screen needs a specific value. */
  radius?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  initials, src, size = 46, tone = 'ink', radius, fontSize, style,
}) => {
  // A stored URL can 404 — a deleted file, a revoked token. Falling back to
  // initials beats a broken-image glyph.
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
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
        overflow: 'hidden',
        ...TONES[tone],
        ...style,
      }}
    >
      {showPhoto ? (
        <img
          src={src as string}
          alt=""
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : initials}
    </div>
  );
};

export default InitialsAvatar;
