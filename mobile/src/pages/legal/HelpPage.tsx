import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, PageBody, PageHeader } from '@/components/ui';

const QA: { q: string; a: string }[] = [
  {
    q: 'How do I book a session?',
    a: 'Find a coach, pick a date and time they are open, and send a request. '
      + 'The coach accepts or declines it. Once they accept, you pay to confirm '
      + 'the session — nothing is charged before that.',
  },
  {
    q: 'When am I charged?',
    a: 'Only after a coach accepts your request. Payment goes through Paystack, '
      + 'so CoachLink never sees your card details.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes, from the session details screen, up until the session is marked '
      + 'complete. Refunds are handled case by case for now — email us.',
  },
  {
    q: 'How do coaches get verified?',
    a: 'Every coach submits a photo and a government-issued ID, and an admin '
      + 'reviews both before the profile appears in search. A coach who has not '
      + 'been approved cannot be found or booked.',
  },
  {
    q: 'When do coaches get paid?',
    a: 'Automatically, once a session is marked complete. CoachLink keeps 8% of '
      + 'the session fee; the rest goes to the bank account on the coach’s '
      + 'Earnings screen.',
  },
  {
    q: 'I paid but my session is not confirmed',
    a: 'Pull down on My Bookings to refresh — confirmation can take a moment. If '
      + 'it still looks wrong after a few minutes, email us with the date and '
      + 'the coach’s name.',
  },
];

/** Plain answers to what people get stuck on, not a support portal. */
const HelpPage: React.FC = () => {
  const history = useHistory();

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Help & FAQ" onBack={() => history.goBack()} />
      </div>

      <PageBody pb={28}>
        {QA.map(({ q, a }) => (
          <AppCard key={q}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--cl-ink)' }}>{q}</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--cl-muted-3)', margin: '8px 0 0' }}>{a}</p>
          </AppCard>
        ))}

        <AppCard style={{ background: 'var(--cl-subtle)', border: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--cl-ink)' }}>Still stuck?</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--cl-muted-3)', margin: '8px 0 0' }}>
            Email <strong>support@coachlink.ng</strong> with what happened and
            roughly when. Include the coach&rsquo;s name if it is about a session.
          </p>
        </AppCard>
      </PageBody>
    </AppPage>
  );
};

export default HelpPage;
