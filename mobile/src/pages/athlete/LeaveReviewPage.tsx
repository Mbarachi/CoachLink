import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppPage, InitialsAvatar, PageBody,
  PageHeader, SectionHeading, StatusBar, StickyFooter,
} from '@/components/ui';

const REVIEWEE: Record<string, { initials: string; name: string; sport: string; date: string }> = {
  completed: { initials: 'EJ', name: 'Emeka Johnson', sport: 'Swimming', date: 'Sat, 18 May' },
};

const LeaveReviewPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const reviewee = REVIEWEE[bookingId] ?? REVIEWEE.completed;
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageHeader title="Leave a review" onBack={() => history.push('/athlete/bookings')} />
      </div>

      <PageBody>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 8 }}>
          <InitialsAvatar initials={reviewee.initials} size={64} radius={18} fontSize={22} />
          <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)', marginTop: 12 }}>{reviewee.name}</div>
          <div style={{ fontSize: 13, color: 'var(--cl-muted-1)', marginTop: 2 }}>{reviewee.sport} · {reviewee.date}</div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--cl-muted-1)', margin: '22px 0 12px' }}>How was your session?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} onClick={() => setRating(n)} style={{ fontSize: 38, lineHeight: 1, cursor: 'pointer', color: n <= rating ? 'var(--cl-accent)' : 'var(--cl-muted-line)' }}>★</span>
          ))}
        </div>

        <SectionHeading style={{ margin: '28px 0 10px' }}>Your review</SectionHeading>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Share how the session went — coaching style, punctuality, results…"
          style={{ width: '100%', height: 120, borderRadius: 'var(--cl-radius-input)', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ height: 90 }} />
      </PageBody>

      <StickyFooter style={{ paddingLeft: 0, paddingRight: 0 }}>
        <AppButton
          size="md"
          onClick={() => history.push('/athlete/review-sent')}
          disabled={rating === 0}
          style={rating === 0 ? { background: 'var(--cl-subtle)', color: 'var(--cl-muted-2)', opacity: 1 } : undefined}
        >
          Submit review
        </AppButton>
      </StickyFooter>
    </AppPage>
  );
};

export default LeaveReviewPage;
