import { IonIcon } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import React from 'react';

interface AppAvatarProps {
  src?: string | null;
  size?: number;
  onClick?: () => void;
  showEditBadge?: boolean;
}

const AppAvatar: React.FC<AppAvatarProps> = ({
  src,
  size = 80,
  onClick,
  showEditBadge = false,
}) => (
  <div
    onClick={onClick}
    style={{
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '50%',
      cursor: onClick ? 'pointer' : 'default',
      flexShrink: 0,
    }}
  >
    {src ? (
      <img
        src={src}
        alt="avatar"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--cl-border)',
        }}
      />
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'var(--cl-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IonIcon
          icon={personCircleOutline}
          style={{ fontSize: size * 0.65, color: 'var(--cl-text-light)' }}
        />
      </div>
    )}
    {showEditBadge && (
      <div
        style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: '50%',
          background: 'var(--cl-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      </div>
    )}
  </div>
);

export default AppAvatar;
