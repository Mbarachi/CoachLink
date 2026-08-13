import { IonIcon } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import React, { useState } from 'react';

import FormLabel from './FormLabel';
import { fieldStyle } from './inputStyles';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label, value, onChange, onBlur, placeholder, error, labelStyle, style,
}) => {
  const [visible, setVisible] = useState(false);
  // Keep the caller's bottom gap below the error, not between input and error.
  const { marginBottom, ...wrapperStyle } = style ?? {};

  return (
    <>
      {label && <FormLabel style={labelStyle}>{label}</FormLabel>}
      <div style={{ position: 'relative', ...wrapperStyle, ...(error ? {} : { marginBottom }) }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          style={{
            ...fieldStyle,
            paddingRight: 44,
            ...(error ? { borderColor: 'var(--cl-destructive)' } : {}),
          }}
        />
        <IonIcon
          icon={visible ? eyeOutline : eyeOffOutline}
          onClick={() => setVisible(v => !v)}
          style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 19, color: 'var(--cl-muted-2)', cursor: 'pointer',
          }}
        />
      </div>
      {error && (
        <p style={{ fontSize: 12.5, color: 'var(--cl-destructive)', margin: '6px 0 0', marginBottom }}>
          {error}
        </p>
      )}
    </>
  );
};

export default PasswordInput;
