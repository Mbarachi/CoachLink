import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, DetailRow, InitialsAvatar,
  PageBody, PageHeader, SectionHeading, StatusBar, StickyFooter,
} from '@/components/ui';

const REQUESTS = [
  { id: '0', initials: 'JD', name: 'John Doe',   sport: 'Swimming', date: 'Wed, 15 May', time: '8:00 AM', venue: 'Festival Hotel Pool', price: '₦12,000', note: 'Beginner — would like to learn freestyle and build confidence in deep water.', child: '' },
  { id: '1', initials: 'AE', name: 'Amara Eze',  sport: 'Swimming', date: 'Thu, 16 May', time: '4:00 PM', venue: 'Festival Hotel Pool', price: '₦12,000', note: 'Booking for my daughter. She is a complete beginner.', child: 'Zara, age 9' },
  { id: '2', initials: 'BS', name: 'Bola Smith', sport: 'Swimming', date: 'Sat, 18 May', time: '7:00 AM', venue: 'Festival Hotel Pool', price: '₦12,000', note: 'Intermediate — focus on endurance and lap times.', child: '' },
];

const RequestDetailsPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const req = REQUESTS[Number(id)] ?? REQUESTS[0];

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageHeader title="Request details" />
      </div>

      <PageBody>
        {/* athlete header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <InitialsAvatar initials={req.initials} size={56} tone="subtle" radius={16} fontSize={18} />
          <div>
            <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cl-ink)' }}>{req.name}</div>
            <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Requested a {req.sport} session</div>
          </div>
        </div>

        {/* child banner */}
        {req.child && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cl-accent)', borderRadius: 14, padding: 13, marginTop: 16 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--cl-ink)', flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: 'var(--cl-ink)' }}><strong>Booking for a child:</strong> {req.child}</div>
          </div>
        )}

        <AppCard padding="4px 16px" style={{ borderRadius: 16, marginTop: 16 }}>
          <DetailRow label="Date" value={req.date} />
          <DetailRow label="Time" value={req.time} />
          <DetailRow label="Venue" value={req.venue} />
          <DetailRow label="Session fee" value={req.price} last />
        </AppCard>

        <SectionHeading style={{ margin: '18px 0 8px' }}>Note from athlete</SectionHeading>
        <AppCard padding={14} style={{ borderRadius: 14, fontSize: 13.5, lineHeight: 1.5, color: 'var(--cl-muted-3)' }}>
          {req.note}
        </AppCard>

        <div style={{ height: 96 }} />
      </PageBody>

      <StickyFooter style={{ display: 'flex', gap: 10, paddingLeft: 0, paddingRight: 0 }}>
        <AppButton variant="outline" size="md" fullWidth={false} onClick={() => history.goBack()} style={{ flex: 1, fontSize: 15 }}>
          Decline
        </AppButton>
        <AppButton size="md" fullWidth={false} onClick={() => history.goBack()} style={{ flex: 2, fontSize: 15 }}>
          Accept &amp; request payment
        </AppButton>
      </StickyFooter>
    </AppPage>
  );
};

export default RequestDetailsPage;
