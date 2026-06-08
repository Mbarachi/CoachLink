import {
  IonContent,
  IonHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';

const IncomingRequestsPage: React.FC = () => {
  const [segment, setSegment] = useState<'pending' | 'accepted' | 'declined'>('pending');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Requests</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value as typeof segment)}
          >
            <IonSegmentButton value="pending">
              <IonLabel>Pending</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="accepted">
              <IonLabel>Accepted</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="declined">
              <IonLabel>Declined</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Placeholder: booking-request list filtered by segment */}
      </IonContent>
    </IonPage>
  );
};

export default IncomingRequestsPage;
