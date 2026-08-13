import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, InitialsAvatar, PageBody, PageTitle, StatusBar, TabChips } from '@/components/ui';

const TABS = ['New · 3', 'Accepted', 'Declined'] as const;

const REQUESTS = [
  { id: '0', initials: 'JD', name: 'John Doe',   sport: 'Swimming', date: 'Wed, 15 May', time: '8:00 AM', price: '₦12,000', note: 'Beginner — would like to learn freestyle and build confidence in deep water.' },
  { id: '1', initials: 'AE', name: 'Amara Eze',  sport: 'Swimming', date: 'Thu, 16 May', time: '4:00 PM', price: '₦12,000', note: 'Booking for my daughter. She is a complete beginner.' },
  { id: '2', initials: 'BS', name: 'Bola Smith', sport: 'Swimming', date: 'Sat, 18 May', time: '7:00 AM', price: '₦12,000', note: 'Intermediate — focus on endurance and lap times.' },
];

const IncomingRequestsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState(0);

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageTitle>Requests</PageTitle>
        <TabChips tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <PageBody style={{ paddingTop: 16 }}>
        {tab === 0 && REQUESTS.map(rq => (
          <AppCard
            key={rq.id}
            onClick={() => history.push(`/coach/requests/${rq.id}`)}
            padding={15}
            style={{ marginBottom: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <InitialsAvatar initials={rq.initials} size={46} tone="subtle" radius={13} fontSize={15} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{rq.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{rq.sport} · {rq.date} · {rq.time}</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>{rq.price}</span>
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)', margin: '11px 0 0' }}>{rq.note}</p>
          </AppCard>
        ))}
        {tab !== 0 && (
          <p style={{ fontSize: 14, color: 'var(--cl-muted-1)', textAlign: 'center', marginTop: 40 }}>No requests here yet.</p>
        )}
      </PageBody>
    </AppPage>
  );
};

export default IncomingRequestsPage;
