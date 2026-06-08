import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const HomePage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>CoachLink</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">CoachLink</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* Placeholder: featured coaches, sport filters, quick search bar */}
    </IonContent>
  </IonPage>
);

export default HomePage;
