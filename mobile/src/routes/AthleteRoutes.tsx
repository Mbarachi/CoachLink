import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import {
  calendarOutline,
  homeOutline,
  notificationsOutline,
  personOutline,
  searchOutline,
} from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import BookingRequestPage from '@/pages/athlete/BookingRequestPage';
import BookingSuccessPage from '@/pages/athlete/BookingSuccessPage';
import CoachDetailsPage from '@/pages/athlete/CoachDetailsPage';
import CoachListingPage from '@/pages/athlete/CoachListingPage';
import HomePage from '@/pages/athlete/HomePage';
import MyBookingsPage from '@/pages/athlete/MyBookingsPage';
import NotificationsPage from '@/pages/athlete/NotificationsPage';
import PaymentPage from '@/pages/athlete/PaymentPage';
import ProfilePage from '@/pages/athlete/ProfilePage';
import SearchCoachesPage from '@/pages/athlete/SearchCoachesPage';
import SettingsPage from '@/pages/athlete/SettingsPage';

const AthleteRoutes: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/athlete/home"          component={HomePage}          exact />
      <Route path="/athlete/search"        component={SearchCoachesPage} exact />
      <Route path="/athlete/bookings"      component={MyBookingsPage}    exact />
      <Route path="/athlete/notifications" component={NotificationsPage} exact />
      <Route path="/athlete/profile"       component={ProfilePage}       exact />

      <Route path="/athlete/coaches"                              component={CoachListingPage}   exact />
      <Route path="/athlete/coaches/:id"                          component={CoachDetailsPage}   exact />
      <Route path="/athlete/booking-request/:coachId"             component={BookingRequestPage} exact />
      <Route path="/athlete/payment/:bookingRequestId"            component={PaymentPage}        exact />
      <Route path="/athlete/booking-success/:bookingId"           component={BookingSuccessPage} exact />
      <Route path="/athlete/settings"                             component={SettingsPage}       exact />

      <Route exact path="/athlete"><Redirect to="/athlete/home" /></Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="home"          href="/athlete/home">
        <IonIcon icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="search"        href="/athlete/search">
        <IonIcon icon={searchOutline} />
        <IonLabel>Search</IonLabel>
      </IonTabButton>
      <IonTabButton tab="bookings"      href="/athlete/bookings">
        <IonIcon icon={calendarOutline} />
        <IonLabel>Bookings</IonLabel>
      </IonTabButton>
      <IonTabButton tab="notifications" href="/athlete/notifications">
        <IonIcon icon={notificationsOutline} />
        <IonLabel>Alerts</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile"       href="/athlete/profile">
        <IonIcon icon={personOutline} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default AthleteRoutes;
