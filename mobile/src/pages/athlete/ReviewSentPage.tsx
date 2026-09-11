import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppButton, SuccessScreen } from '@/components/ui';

const ReviewSentPage: React.FC = () => {
  const history = useHistory();

  return (
    <SuccessScreen
      title="Thanks for the review"
      message="Your feedback helps other athletes find the right coach."
    >
      <AppButton variant="ink" size="md" onClick={() => history.replace('/athlete/bookings')} style={{ marginTop: 30 }}>
        Back to my bookings
      </AppButton>
    </SuccessScreen>
  );
};

export default ReviewSentPage;
