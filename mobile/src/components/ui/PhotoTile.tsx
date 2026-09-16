import React, { useState } from 'react';

interface PhotoTileProps {
  /** Overlaid in the bottom-left corner while real photography is pending. */
  initials?: string;
  /** A real photo when one exists; the stripes are the placeholder. */
  src?: string | null;
  size?: number;
  radius?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}

/** Striped placeholder standing in for coach/athlete photography. */
const PhotoTile: React.FC<PhotoTileProps> = ({ initials, src, size = 62, radius, fontSize, style }) => {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div
      style={{
      width: size,
      height: size,
      borderRadius: radius ?? Math.round(size * 0.26),
      flexShrink: 0,
        backgroundImage: showPhoto
          ? undefined
          : 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 9px, var(--cl-photo-dark-2) 9px 18px)',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
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
      ) : initials && (
        <span style={{
          fontFamily: 'var(--cl-font-display)', fontWeight: 700,
          fontSize: fontSize ?? Math.round(size * 0.24),
          color: 'var(--cl-accent)', padding: '6px 8px',
        }}>{initials}</span>
      )}
    </div>
  );
};

export default PhotoTile;
