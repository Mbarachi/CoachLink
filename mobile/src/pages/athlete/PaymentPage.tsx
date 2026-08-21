import React from 'react';

import { AppPage, EmptyState, PageBody, PageHeader, StatusBar } from '@/components/ui';

/**
 * PaymentPage has no backend module yet. Rather than showing invented data it
 * says so plainly; see docs/api-spec.md for the endpoints still to be built.
 */
const PaymentPage: React.FC = () => (
  <AppPage padding="screen">
    <div style={{ flexShrink: 0 }}>
      <StatusBar />
      <PageHeader title="Payment" />
    </div>

    <PageBody>
      <EmptyState
        illustration="wallet"
        title="Payments aren’t live yet"
        message={"Paystack checkout is still to be built \u2014 your coach has your request either way."}
      />
    </PageBody>
  </AppPage>
);

export default PaymentPage;
