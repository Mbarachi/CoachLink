import React from 'react';

import FormLabel from './FormLabel';
import { fieldStyle } from './inputStyles';

interface AppInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  error?: string;
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const AppInput: React.FC<AppInputProps> = ({
  label, value, onChange, placeholder, type = 'text', error, labelStyle, style,
}) => {
  // The caller's bottom gap must sit below whichever element renders last,
  // otherwise an error message ends up hugging the next field's label.
  const { marginBottom, ...inputStyle } = style ?? {};

  return (
    <>
      {label && <FormLabel style={labelStyle}>{label}</FormLabel>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...fieldStyle,
          ...(error ? { borderColor: 'var(--cl-destructive)' } : {}),
          ...inputStyle,
          ...(error ? {} : { marginBottom }),
        }}
      />
      {error && (
        <p style={{ fontSize: 12.5, color: 'var(--cl-destructive)', margin: '6px 0 0', marginBottom }}>
          {error}
        </p>
      )}
    </>
  );
};

export default AppInput;
