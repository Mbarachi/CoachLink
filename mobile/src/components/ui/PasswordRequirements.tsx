import { IonIcon } from '@ionic/react';
import { checkmarkCircle, ellipseOutline } from 'ionicons/icons';
import React from 'react';

export const PASSWORD_RULES: { label: string; test: (pw: string) => boolean }[] = [
  { label: 'At least 8 characters', test: pw => pw.length >= 8 },
  { label: 'One uppercase letter', test: pw => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: pw => /[a-z]/.test(pw) },
  { label: 'One number', test: pw => /[0-9]/.test(pw) },
  { label: 'One special character', test: pw => /[^A-Za-z0-9]/.test(pw) },
];

export const isPasswordValid = (pw: string) => PASSWORD_RULES.every(rule => rule.test(pw));

interface PasswordRequirementsProps {
  password: string;
  style?: React.CSSProperties;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, style }) => {
  if (!password) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '9px 2px 15px', ...style }}>
      {PASSWORD_RULES.map(rule => {
        const met = rule.test(password);
        return (
          <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <IonIcon
              icon={met ? checkmarkCircle : ellipseOutline}
              style={{ fontSize: 14, color: met ? 'var(--cl-success-text)' : 'var(--cl-muted-line)', flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: met ? 'var(--cl-success-text)' : 'var(--cl-muted-2)' }}>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;
