import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const SettingsPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/athlete/profile" />
        </IonButtons>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonList>
        <IonListHeader>Account</IonListHeader>
        <IonItem button detail>
          <IonLabel>Change Password</IonLabel>
        </IonItem>
        <IonItem button detail>
          <IonLabel>Notifications</IonLabel>
        </IonItem>
      </IonList>

      <IonList>
        <IonListHeader>About</IonListHeader>
        <IonItem button detail>
          <IonLabel>Privacy Policy</IonLabel>
        </IonItem>
        <IonItem button detail>
          <IonLabel>Terms of Service</IonLabel>
        </IonItem>
      </IonList>

      <IonList>
        <IonItem button color="danger">
          <IonLabel>Sign Out</IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
);

export default SettingsPage;
