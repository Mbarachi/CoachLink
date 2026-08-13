import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, SuccessScreen } from '@/components/ui';

const ResetPasswordSuccessPage: React.FC = () => {
  const history = useHistory();

  return (
    <SuccessScreen
      title="Password reset"
      message="Your password has been reset successfully. Sign in with your new password to continue."
    >
      <AppButton variant="ink" onClick={() => history.replace('/auth/signin')} style={{ marginTop: 30 }}>
        Back to sign in
      </AppButton>
    </SuccessScreen>
  );
};

export default ResetPasswordSuccessPage;
