import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const ProfileManagementPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>My Profile</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* Placeholder: avatar upload, bio, sports badges, hourlyRate, state/area, save */}
    </IonContent>
  </IonPage>
);

export default ProfileManagementPage;
