import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, InitialsAvatar, PageBody, PageTitle, StatusBar, StatusPill, TabChips } from '@/components/ui';

const TABS = ['Upcoming', 'Completed', 'Cancelled'] as const;

export const BOOKINGS = [
  { id: 'pending',          initials: 'SD', name: 'Sarah Danjuma',   sport: 'Tennis',   venue: 'MU Court',            date: 'Sat, 18 May', time: '10:00 AM', status: 'Pending',   price: '₦18,000', coachId: '3' },
  { id: 'accepted-package', initials: 'TA', name: 'Tobi Adebayo',    sport: 'Swimming', venue: 'Festival Hotel Pool', date: 'Wed & Fri',   time: '8:00 AM',  status: 'Accepted',  price: '₦96,000', coachId: '0' },
  { id: 'confirmed-single', initials: 'CO', name: 'Chidinma Okafor', sport: 'Tennis',   venue: 'MU Court',            date: 'Fri, 17 May', time: '5:00 PM',  status: 'Confirmed', price: '₦15,000', coachId: '1' },
  { id: 'completed',        initials: 'EJ', name: 'Emeka Johnson',   sport: 'Swimming', venue: 'Golden Tulip Pool',   date: 'Sat, 18 May', time: '7:00 AM',  status: 'Completed', price: '₦9,000',  coachId: '2' },
  { id: 'cancelled',        initials: 'YB', name: 'Yusuf Bello',     sport: 'Swimming', venue: 'Golden Tulip Pool',   date: 'Mon, 13 May', time: '6:00 AM',  status: 'Cancelled', price: '₦7,500',  coachId: '4' },
];

const TAB_STATUSES: Record<typeof TABS[number], string[]> = {
  Upcoming: ['Pending', 'Accepted', 'Confirmed'],
  Completed: ['Completed'],
  Cancelled: ['Cancelled'],
};

const MyBookingsPage: React.FC = () => {
  const history = useHistory();
  const [tab, setTab] = useState(0);
  const visible = BOOKINGS.filter(b => TAB_STATUSES[TABS[tab]].includes(b.status));

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageTitle>My bookings</PageTitle>
        <TabChips tabs={TABS} active={tab} onChange={setTab} />
      </div>

      <PageBody style={{ paddingTop: 16 }}>
        {visible.map(b => (
          <AppCard key={b.id} onClick={() => history.push(`/athlete/bookings/${b.id}`)} padding={15} style={{ marginBottom: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <InitialsAvatar initials={b.initials} size={46} radius={13} fontSize={15} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{b.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{b.sport} · {b.venue}</div>
              </div>
              <StatusPill status={b.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 13, fontSize: 12.5, color: 'var(--cl-muted-3)' }}>
              <span>📅 {b.date}</span>
              <span>🕗 {b.time}</span>
            </div>
          </AppCard>
        ))}
      </PageBody>
    </AppPage>
  );
};

export default MyBookingsPage;
