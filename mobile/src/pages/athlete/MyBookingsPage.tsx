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

const MyBookingsPage: React.FC = () => {
  const [segment, setSegment] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Bookings</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value as typeof segment)}
          >
            <IonSegmentButton value="upcoming">
              <IonLabel>Upcoming</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="completed">
              <IonLabel>Completed</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cancelled">
              <IonLabel>Cancelled</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Placeholder: booking list filtered by segment value */}
      </IonContent>
    </IonPage>
  );
};

export default MyBookingsPage;
