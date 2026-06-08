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

const CoachDetailsPage: React.FC = () => {
  const { id } = useParams<Params>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/athlete/search" />
          </IonButtons>
          <IonTitle>Coach Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {/* Placeholder: avatar, name, sport badges, rating, bio, hourlyRate, Book CTA */}
        {/* coachId: {id} */}
      </IonContent>
    </IonPage>
  );
};

export default CoachDetailsPage;
