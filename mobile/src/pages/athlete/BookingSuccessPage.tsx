import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';

interface Params {
  bookingId: string;
}

const BookingSuccessPage: React.FC = () => {
  const { bookingId } = useParams<Params>();

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding ion-text-center">
        {/* Placeholder: success illustration, confirmation message, View Booking CTA */}
        {/* bookingId: {bookingId} */}
      </IonContent>
    </IonPage>
  );
};

export default BookingSuccessPage;
