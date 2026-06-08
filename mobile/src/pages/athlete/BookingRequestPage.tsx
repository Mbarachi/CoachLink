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
  coachId: string;
}

const BookingRequestPage: React.FC = () => {
  const { coachId } = useParams<Params>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/athlete/coaches/${coachId}`} />
          </IonButtons>
          <IonTitle>Request Session</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* Placeholder: sport picker, date/time picker, notes textarea, submit */}
        {/* coachId: {coachId} */}
      </IonContent>
    </IonPage>
  );
};

export default BookingRequestPage;
