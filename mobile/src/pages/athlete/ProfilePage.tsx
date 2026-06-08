import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const ProfilePage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Profile</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* Placeholder: avatar, name, role badge, edit form, settings link */}
    </IonContent>
  </IonPage>
);

export default ProfilePage;
