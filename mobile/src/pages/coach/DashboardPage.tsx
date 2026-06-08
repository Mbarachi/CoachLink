import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const DashboardPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Dashboard</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* Placeholder: welcome banner, pending requests count, upcoming sessions, earnings link */}
    </IonContent>
  </IonPage>
);

export default DashboardPage;
