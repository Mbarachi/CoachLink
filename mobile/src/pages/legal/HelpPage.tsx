import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, PageBody, PageHeader } from '@/components/ui';
import { OPERATOR, SUPPORT_EMAIL } from '@/lib/support';

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
    a: 'Before you pay, yes: from the session details screen. Once a session is '
      + 'paid for it is locked in and can’t be cancelled in the app, so check the '
      + 'dates first. If something unexpected comes up, email us and we’ll help.',
  },
  {
    q: 'How do coaches get verified?',
    a: 'Every coach submits a photo and a government-issued ID, and an admin '
      + 'reviews both before the profile appears in search. A coach who has not '
      + 'been approved cannot be found or booked.',
  },
  {
    q: 'When do coaches get paid?',
    a: 'Automatically, once a session is marked complete — there is nothing to '
      + 'withdraw. CoachLink keeps 8% of the session fee; the rest goes to the bank '
      + 'account on the coach’s Earnings screen, usually within a working day of '
      + 'the athlete’s payment clearing.',
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
  // Several can be open at once, so comparing two answers needs no back and forth.
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (q: string) =>
    setOpen((prev) => (prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q]));

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Help & FAQ" onBack={() => history.goBack()} />
      </div>

      <PageBody pb={28}>
        {/* Questions only, until one is tapped: the list reads at a glance and
            the answer someone came for is one tap away. */}
        {QA.map(({ q, a }) => {
          const isOpen = open.includes(q);
          return (
            <AppCard key={q} padding={0} style={{ marginBottom: 10, overflow: 'hidden' }}>
              <button
                onClick={() => toggle(q)}
                aria-expanded={isOpen}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--cl-font-body)' }}
              >
                <span style={{ flex: 1, fontWeight: 700, fontSize: 14.5, color: 'var(--cl-ink)' }}>{q}</span>
                <IonIcon
                  icon={chevronDownOutline}
                  aria-hidden="true"
                  style={{ fontSize: 17, color: 'var(--cl-muted-2)', flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                />
              </button>
              {isOpen && (
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--cl-muted-3)', margin: 0, padding: '0 16px 16px' }}>{a}</p>
              )}
            </AppCard>
          );
        })}

        <AppCard style={{ background: 'var(--cl-subtle)', border: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--cl-ink)' }}>Still stuck?</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--cl-muted-3)', margin: '8px 0 0' }}>
            Email <strong>{SUPPORT_EMAIL}</strong> with what happened and
            roughly when. Include the coach&rsquo;s name if it is about a session.
            It is a webhammer.com.ng address because CoachLink is run by {OPERATOR}.
          </p>
        </AppCard>
      </PageBody>
    </AppPage>
  );
};

export default HelpPage;
