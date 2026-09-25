import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppPage, PageBody, PageHeader, SectionHeading } from '@/components/ui';

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--cl-muted-3)', margin: '0 0 12px' }}>
    {children}
  </p>
);

/**
 * Privacy and terms in one screen.
 *
 * Written from what the app actually does rather than from a template: the
 * things worth saying out loud here are the ID document, the 8% commission and
 * the fact that a coach's reviews carry the reviewer's name.
 */
const LegalPage: React.FC = () => {
  const history = useHistory();

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Privacy & terms" onBack={() => history.goBack()} />
      </div>

      <PageBody pb={28}>
        <P>
          CoachLink connects athletes and parents in Amuwo Odofin, Lagos with
          verified swimming and tennis coaches. Last updated September 2026.
        </P>

        <SectionHeading>What we collect</SectionHeading>
        <P>
          Your name, email address and phone number when you sign up. If you
          sign up as a coach, also a profile photo, a government-issued ID, your
          venue, your rate and your availability. For everyone: the sessions you
          book, the payments you make or receive, and the reviews you leave.
        </P>
        <P>
          On a phone we also store a notification token so we can reach you when
          the app is closed. You can turn that off in Settings.
        </P>

        <SectionHeading>Your ID document</SectionHeading>
        <P>
          A coach&rsquo;s ID is used once, to verify they are who they say they
          are, and is never shown to athletes. It is stored so that only a
          CoachLink administrator can open it — there is no shareable link to it,
          by design.
        </P>

        <SectionHeading>What is public</SectionHeading>
        <P>
          An approved coach&rsquo;s name, photo, sports, venue, rate, experience,
          rating and reviews are visible to anyone using the app, including
          people who have not signed up. A review shows the first name and
          surname of whoever wrote it, alongside what they wrote.
        </P>

        <SectionHeading>Who else sees your data</SectionHeading>
        <P>
          Payments are handled by Paystack, who receive what they need to take or
          send money. Notifications are delivered by OneSignal. The app runs on
          Google Firebase. We do not sell your data and we do not use it for
          advertising.
        </P>

        <SectionHeading>Payments and commission</SectionHeading>
        <P>
          You pay only after a coach accepts your request. CoachLink keeps 8% of
          each session fee; the coach receives the rest, transferred
          automatically once the session is marked complete. Card details are
          entered with Paystack and never reach CoachLink.
        </P>

        <SectionHeading>Sessions and cancellations</SectionHeading>
        <P>
          Either side may cancel a session before it is marked complete. Only the
          coach can mark a session complete, and only after its start time has
          passed. Coaching happens between you and the coach in person;
          CoachLink is not a party to it and does not supervise sessions.
        </P>

        <SectionHeading>Reviews</SectionHeading>
        <P>
          You can review a session you paid for and attended, once. Reviews stay
          on the coach&rsquo;s profile. We remove ones that are abusive or
          clearly not about a real session.
        </P>

        <SectionHeading>Deleting your account</SectionHeading>
        <P>
          Email <strong>support@coachlink.ng</strong> and we will delete your
          account and personal data, including a coach&rsquo;s ID document.
          Records we are required to keep for tax or payment purposes are the
          exception.
        </P>

        <SectionHeading>Contact</SectionHeading>
        <P>
          <strong>support@coachlink.ng</strong> for anything on this page.
        </P>
      </PageBody>
    </AppPage>
  );
};

export default LegalPage;
