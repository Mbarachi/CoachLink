import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const SearchCoachesPage: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Find a Coach</IonTitle>
      </IonToolbar>
      <IonToolbar>
        <IonSearchbar placeholder="Search by name or area" />
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      {/* Placeholder: sport filter chips, area filter, coach card list */}
    </IonContent>
  </IonPage>
);

export default SearchCoachesPage;
