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

const OtpVerificationPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/auth/signup" />
        </IonButtons>
        <IonTitle>Verify OTP</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen className="ion-padding">
      {/* Placeholder: 6-digit OTP input, resend link, verify CTA */}
    </IonContent>
  </IonPage>
);

export default OtpVerificationPage;
