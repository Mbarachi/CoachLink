import React from 'react';

import { AppPage, EmptyState, PageBody, PageHeader } from '@/components/ui';

/**
 * AvailabilityPage has no backend module yet. Rather than showing invented data it
 * says so plainly; see docs/api-spec.md for the endpoints still to be built.
 */
const AvailabilityPage: React.FC = () => (
  <AppPage padding="screen">
    <div style={{ flexShrink: 0 }}>
      <PageHeader title="Availability" />
    </div>

    <PageBody>
      <EmptyState
        illustration="calendar"
        title="Availability isn’t live yet"
        message={"For now athletes propose a time and you accept or decline each request."}
      />
    </PageBody>
  </AppPage>
);

export default AvailabilityPage;
