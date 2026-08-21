import React from 'react';

import { AppPage, EmptyState, PageBody, PageTitle, StatusBar } from '@/components/ui';

/**
 * EarningsSummaryPage has no backend module yet. Rather than showing invented data it
 * says so plainly; see docs/api-spec.md for the endpoints still to be built.
 */
const EarningsSummaryPage: React.FC = () => (
  <AppPage padding="screen">
    <div style={{ flexShrink: 0 }}>
      <StatusBar />
      <PageTitle>Earnings</PageTitle>
    </div>

    <PageBody>
      <EmptyState
        illustration="wallet"
        title="No earnings yet"
        message={"Payouts appear here once payments go live and your sessions are paid for."}
      />
    </PageBody>
  </AppPage>
);

export default EarningsSummaryPage;
