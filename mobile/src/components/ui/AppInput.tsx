import { IonIcon, IonInput, IonItem, IonLabel, IonNote } from '@ionic/react';
import React, { useState } from 'react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

interface AppInputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea';
  value?: string;
  onIonInput?: (e: CustomEvent) => void;
  onIonBlur?: () => void;
  error?: string;
  icon?: string;
  readonly?: boolean;
  disabled?: boolean;
  autocomplete?: string;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onIonInput,
  onIonBlur,
  error,
  icon,
  readonly = false,
  disabled = false,
  autocomplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <IonLabel
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--cl-text-main)',
            marginBottom: 6,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {label}
        </IonLabel>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          border: `1.5px solid ${error ? 'var(--cl-error)' : 'var(--cl-border)'}`,
          borderRadius: 12,
          padding: '0 14px',
          minHeight: 52,
        }}
      >
        {icon && (
          <IonIcon
            icon={icon}
            style={{
              fontSize: 18,
              color: 'var(--cl-text-light)',
              marginRight: 10,
              flexShrink: 0,
            }}
          />
        )}
        <IonInput
          type={resolvedType as any}
          placeholder={placeholder}
          value={value}
          onIonInput={onIonInput}
          onIonBlur={onIonBlur}
          readonly={readonly}
          disabled={disabled}
          autocomplete={autocomplete as any}
          style={{
            '--padding-start': '0',
            '--padding-end': '0',
            '--padding-top': '0',
            '--padding-bottom': '0',
            fontSize: 15,
            color: 'var(--cl-text-main)',
            fontFamily: 'Poppins, sans-serif',
            flex: 1,
          }}
        />
        {type === 'password' && (
          <IonIcon
            icon={showPassword ? eyeOffOutline : eyeOutline}
            onClick={() => setShowPassword((s) => !s)}
            style={{
              fontSize: 20,
              color: 'var(--cl-text-light)',
              cursor: 'pointer',
              marginLeft: 8,
              flexShrink: 0,
            }}
          />
        )}
      </div>
      {error && (
        <p
          style={{
            margin: '4px 0 0 4px',
            fontSize: 12,
            color: 'var(--cl-error)',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AppInput;
