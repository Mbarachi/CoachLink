import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const NotificationsPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Notifications</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      {/* Placeholder: notification list, mark-all-read button, per-item swipe-to-dismiss */}
    </IonContent>
  </IonPage>
);

export default NotificationsPage;
