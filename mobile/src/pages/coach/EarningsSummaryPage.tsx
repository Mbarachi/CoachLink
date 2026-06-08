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

const EarningsSummaryPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/coach/dashboard" />
        </IonButtons>
        <IonTitle>Earnings</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      {/* Placeholder: total earnings, completed sessions count, per-booking breakdown */}
    </IonContent>
  </IonPage>
);

export default EarningsSummaryPage;
