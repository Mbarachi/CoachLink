import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';

interface Params {
  bookingRequestId: string;
}

const PaymentPage: React.FC = () => {
  const { bookingRequestId } = useParams<Params>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/athlete/bookings" />
          </IonButtons>
          <IonTitle>Payment</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* Placeholder: booking summary, amount, Pay with Paystack CTA */}
        {/* bookingRequestId: {bookingRequestId} */}
      </IonContent>
    </IonPage>
  );
};

export default PaymentPage;
