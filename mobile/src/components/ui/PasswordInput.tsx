import { IonIcon } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import React, { useState } from 'react';

import FormLabel from './FormLabel';
import { fieldStyle } from './inputStyles';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label, value, onChange, placeholder, labelStyle, style,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {label && <FormLabel style={labelStyle}>{label}</FormLabel>}
      <div style={{ position: 'relative', ...style }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...fieldStyle, paddingRight: 44 }}
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
    </>
  );
};

export default PasswordInput;
