import React from 'react';
import { useHistory } from 'react-router-dom';

interface BackButtonProps {
  /** 38 in stacked headers, 40 when standing alone on auth screens. */
  size?: 38 | 40;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ size = 38, onClick, style }) => {
  const history = useHistory();
  return (
    <button
      onClick={onClick ?? (() => history.goBack())}
      aria-label="Back"
      style={{
        width: size, height: size, borderRadius: '50%',
        border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
        /* Explicit, because a bare button inherits the UA's buttontext,
           which flips to white under color-scheme: dark. */
        color: 'var(--cl-ink)',
        /* Grid centring around a drawn chevron. The old '‹' glyph sat
           wherever the font's em box put it — never the middle of the
           circle, and somewhere else again if the webfont failed to load. */
        display: 'grid', placeItems: 'center', padding: 0,
        cursor: 'pointer', flexShrink: 0,
        ...style,
      }}
    >
      {/* Symmetric about 12,12 in both axes, so the circle centres it exactly. */}
      <svg width={size === 40 ? 21 : 20} height={size === 40 ? 21 : 20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 5 9 12l6 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default BackButton;
