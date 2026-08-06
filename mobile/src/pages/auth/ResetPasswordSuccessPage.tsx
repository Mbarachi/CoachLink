import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, AppPage } from '@/components/ui';

const ResetPasswordSuccessPage: React.FC = () => {
  const history = useHistory();

  return (
    <AppPage padding="hero" center>
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, color: 'var(--cl-on-accent)' }}>✓</div>
      <h2 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 27, letterSpacing: '-0.02em', color: 'var(--cl-ink)', margin: '26px 0 10px' }}>Password reset</h2>
      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: 0 }}>
        Your password has been reset successfully. Sign in with your new password to continue.
      </p>
      <AppButton variant="ink" onClick={() => history.replace('/auth/signin')} style={{ marginTop: 30 }}>
        Back to sign in
      </AppButton>
    </AppPage>
  );
};

export default ResetPasswordSuccessPage;
