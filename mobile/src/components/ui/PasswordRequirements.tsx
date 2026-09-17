import { IonIcon } from '@ionic/react';
import { ellipseOutline } from 'ionicons/icons';
import React from 'react';

import { unmetPasswordRules } from '@/lib/schemas/password';

interface PasswordRequirementsProps {
  password: string;
  style?: React.CSSProperties;
}

/**
 * Lists only the criteria still outstanding — satisfied rules drop off, so the
 * list shrinks to nothing once the password is strong enough.
 */
const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, style }) => {
  if (!password) return null;

  const outstanding = unmetPasswordRules(password);
  if (outstanding.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '9px 2px 24px', ...style }}>
      {outstanding.map(rule => (
        <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <IonIcon icon={ellipseOutline} style={{ fontSize: 14, color: 'var(--cl-muted-line)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--cl-muted-2)' }}>{rule.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordRequirements;
