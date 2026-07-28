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
  cashOutline,
  gridOutline,
  settingsOutline,
  listOutline,
} from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import AvailabilityPage      from '@/pages/coach/AvailabilityPage';
import DashboardPage         from '@/pages/coach/DashboardPage';
import EarningsSummaryPage   from '@/pages/coach/EarningsSummaryPage';
import IncomingRequestsPage  from '@/pages/coach/IncomingRequestsPage';
import ProfileManagementPage from '@/pages/coach/ProfileManagementPage';
import RequestDetailsPage    from '@/pages/coach/RequestDetailsPage';
import CoachSettingsPage     from '@/pages/coach/SettingsPage';

const CoachRoutes: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/coach/dashboard"    component={DashboardPage}         exact />
      <Route path="/coach/requests"     component={IncomingRequestsPage}  exact />
      <Route path="/coach/availability" component={AvailabilityPage}      exact />
      <Route path="/coach/earnings"     component={EarningsSummaryPage}   exact />
      <Route path="/coach/settings"     component={CoachSettingsPage}     exact />
      <Route path="/coach/profile"      component={ProfileManagementPage} exact />

      <Route path="/coach/requests/:id" component={RequestDetailsPage}    exact />

      <Route exact path="/coach"><Redirect to="/coach/dashboard" /></Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="dashboard"    href="/coach/dashboard">
        <IonIcon icon={gridOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="requests"     href="/coach/requests">
        <IonIcon icon={listOutline} />
        <IonLabel>Requests</IonLabel>
      </IonTabButton>
      <IonTabButton tab="availability" href="/coach/availability">
        <IonIcon icon={calendarOutline} />
        <IonLabel>Calendar</IonLabel>
      </IonTabButton>
      <IonTabButton tab="earnings"     href="/coach/earnings">
        <IonIcon icon={cashOutline} />
        <IonLabel>Earnings</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings"     href="/coach/settings">
        <IonIcon icon={settingsOutline} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default CoachRoutes;
