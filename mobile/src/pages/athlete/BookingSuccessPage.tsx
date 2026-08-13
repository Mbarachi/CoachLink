import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { AppButton, SuccessScreen } from '@/components/ui';

const BookingSuccessPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation<{ coachName?: string } | undefined>();
  const paid = bookingId === 'paid';
  const coachName = location.state?.coachName ?? 'your coach';

  return (
    <SuccessScreen
      title={paid ? 'Booking confirmed' : 'Request sent'}
      message={paid
        ? `Payment received. Your session with ${coachName} is confirmed. See you on the court.`
        : `Your request has been sent to ${coachName}. We'll notify you the moment they respond — then you can pay to confirm.`}
    >
      <AppButton variant="ink" size="md" onClick={() => history.push('/athlete/bookings')} style={{ marginTop: 30 }}>
        View my bookings
      </AppButton>
      <AppButton variant="text" onClick={() => history.push('/athlete/home')} style={{ marginTop: 11 }}>
        Back to home
      </AppButton>
    </SuccessScreen>
  );
};

export default BookingSuccessPage;
