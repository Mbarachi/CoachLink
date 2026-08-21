import React from 'react';

import { AppPage, EmptyState, PageBody, PageTitle, StatusBar } from '@/components/ui';

/**
 * NotificationsPage has no backend module yet. Rather than showing invented data it
 * says so plainly; see docs/api-spec.md for the endpoints still to be built.
 */
const NotificationsPage: React.FC = () => (
  <AppPage padding="screen">
    <div style={{ flexShrink: 0 }}>
      <StatusBar />
      <PageTitle>Notifications</PageTitle>
    </div>

    <PageBody>
      <EmptyState
        illustration="notifications"
        title="No notifications"
        message={"You’ll be notified here when a coach responds to one of your requests."}
      />
    </PageBody>
  </AppPage>
);

export default NotificationsPage;
