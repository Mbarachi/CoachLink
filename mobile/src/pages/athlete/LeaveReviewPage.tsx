import React from 'react';

import { AppPage, EmptyState, PageBody, PageHeader } from '@/components/ui';

/**
 * LeaveReviewPage has no backend module yet. Rather than showing invented data it
 * says so plainly; see docs/api-spec.md for the endpoints still to be built.
 */
const LeaveReviewPage: React.FC = () => (
  <AppPage padding="screen">
    <div style={{ flexShrink: 0 }}>
      <PageHeader title="Leave a review" />
    </div>

    <PageBody>
      <EmptyState
        illustration="reviews"
        title="Reviews aren’t live yet"
        message={"You’ll be able to review a coach once sessions can be completed and paid for."}
      />
    </PageBody>
  </AppPage>
);

export default LeaveReviewPage;
