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
      style={{
        width: size, height: size, borderRadius: '50%',
        border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
        /* Explicit, because a bare button inherits the UA's buttontext,
           which flips to white under color-scheme: dark. */
        color: 'var(--cl-ink)',
        fontSize: 18, cursor: 'pointer', flexShrink: 0,
        ...style,
      }}
    >‹</button>
  );
};

export default BackButton;
