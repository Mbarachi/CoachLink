import { IonButton, IonSpinner } from '@ionic/react';
import React from 'react';

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'ghost';
  expand?: 'block' | 'full';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  expand = 'block',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const fill = variant === 'primary' ? 'solid' : variant === 'outline' ? 'outline' : 'clear';
  const color = variant === 'ghost' ? 'medium' : 'primary';

  return (
    <IonButton
      expand={expand}
      fill={fill}
      color={color}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      style={{
        '--border-radius': '12px',
        '--padding-top': '16px',
        '--padding-bottom': '16px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '16px',
        letterSpacing: '0.01em',
        textTransform: 'none',
      }}
    >
      {loading ? <IonSpinner name="crescent" /> : children}
    </IonButton>
  );
};

export default AppButton;
