import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const AvailabilityPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Availability</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      {/* Placeholder: weekly calendar grid, toggle slots on/off, save CTA */}
    </IonContent>
  </IonPage>
);

export default AvailabilityPage;
