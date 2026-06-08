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
  id: string;
}

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<Params>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/coach/requests" />
          </IonButtons>
          <IonTitle>Request Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* Placeholder: athlete info, sport, proposed date/time, notes, Accept / Decline actions */}
        {/* requestId: {id} */}
      </IonContent>
    </IonPage>
  );
};

export default RequestDetailsPage;
