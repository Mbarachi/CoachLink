import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppPage, InitialsAvatar, PageBody, PageHeader, QueryState,
  StarRating, StickyFooter, fieldStyle,
} from '@/components/ui';
import { useBooking, useCreateReview } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { formatSessionDate, fullName, initialsOf } from '@/lib/format';
import { useUiStore } from '@/store/ui.store';

/** What each score means, so a tap is a considered one rather than a reflex. */
const MEANINGS: Record<number, string> = {
  1: 'Poor — I would not book again',
  2: 'Below what I expected',
  3: 'Fine',
  4: 'Good — I would book again',
  5: 'Excellent',
};

const LeaveReviewPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const showToast = useUiStore((s) => s.showToast);

  const query = useBooking(bookingId);
  const create = useCreateReview();
  const booking = query.data;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submit = async () => {
    try {
      await create.mutateAsync({
        bookingId,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      });
      history.replace('/athlete/review-sent');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not send that review.'), 'danger');
    }
  };

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="Leave a review" onBack={() => history.goBack()} />
      </div>

      <PageBody pb={20}>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {!booking ? null : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <InitialsAvatar
                  initials={initialsOf(booking.coach.firstName, booking.coach.lastName)}
                  size={54} radius={15} fontSize={17}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)' }}>
                    {fullName(booking.coach.firstName, booking.coach.lastName)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>
                    {booking.sport.name} · {formatSessionDate(booking.scheduledAt)}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cl-ink)' }}>
                  How was the session?
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
                  <StarRating value={rating} onChange={setRating} size={34} />
                </div>
                {/* Reserved whether or not a score is chosen, so the stars do
                    not jump the moment one is tapped. */}
                <div style={{ minHeight: 20, marginTop: 8, fontSize: 13, color: 'var(--cl-muted-1)' }}>
                  {MEANINGS[rating] ?? ''}
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <label
                  htmlFor="review-comment"
                  style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--cl-muted-3)', marginBottom: 8 }}
                >
                  Anything to add? <span style={{ fontWeight: 400, color: 'var(--cl-muted-2)' }}>Optional</span>
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                  placeholder="What other athletes would want to know."
                  rows={5}
                  style={{ ...fieldStyle, height: 'auto', padding: '13px 15px', resize: 'none', lineHeight: 1.5 }}
                />
                <div style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', marginTop: 6 }}>
                  Your name and this review are shown on the coach&rsquo;s profile.
                </div>
              </div>
            </>
          )}
        </QueryState>
      </PageBody>

      {booking && (
        <StickyFooter>
          <AppButton
            size="md"
            disabled={rating === 0}
            loading={create.isPending}
            loadingLabel="Sending…"
            onClick={() => void submit()}
          >
            {rating === 0 ? 'Pick a rating' : 'Send review'}
          </AppButton>
        </StickyFooter>
      )}
    </AppPage>
  );
};

export default LeaveReviewPage;
