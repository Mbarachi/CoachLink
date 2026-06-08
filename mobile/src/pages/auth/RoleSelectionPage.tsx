import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const RoleSelectionPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>I am a…</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      {/* Placeholder: Athlete card, Parent card, Coach card – tap to set role */}
    </IonContent>
  </IonPage>
);

export default RoleSelectionPage;
