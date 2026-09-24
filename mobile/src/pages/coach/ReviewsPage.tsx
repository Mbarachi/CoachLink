import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppCard, AppPage, EmptyState, InitialsAvatar, PageBody, PageHeader,
  QueryState, RatingStar, StarRating,
} from '@/components/ui';
import { useCoachReviews, useMyCoachProfile } from '@/hooks';
import { formatShortDate, initialsOf } from '@/lib/format';

/** How many of each score, so a 4.6 says what it is made of. */
const Distribution: React.FC<{ counts: number[]; total: number }> = ({ counts, total }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    {[5, 4, 3, 2, 1].map((score) => {
      const n = counts[score - 1] ?? 0;
      return (
        <div key={score} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--cl-muted-2)', width: 8 }}>{score}</span>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--cl-subtle)', overflow: 'hidden' }}>
            <div style={{
              width: total ? `${(n / total) * 100}%` : 0,
              height: '100%', background: 'var(--cl-star)',
            }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--cl-muted-2)', width: 14, textAlign: 'right' }}>{n}</span>
        </div>
      );
    })}
  </div>
);

/**
 * What athletes said, for the coach who was reviewed.
 *
 * Its own screen rather than a block on the profile page: that page is an edit
 * form ending in Save, and reviews are the one thing on it a coach cannot
 * change. It is also where the "you have a new review" notification lands, so
 * it has to answer "what did they say" on its own.
 */
const ReviewsPage: React.FC = () => {
  const history = useHistory();
  const profileQuery = useMyCoachProfile();
  const profile = profileQuery.data?.profile;
  const reviewsQuery = useCoachReviews(profile?.id);
  const reviews = useMemo(() => reviewsQuery.data ?? [], [reviewsQuery.data]);

  const counts = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    for (const r of reviews) {
      if (r.rating >= 1 && r.rating <= 5) buckets[r.rating - 1] += 1;
    }
    return buckets;
  }, [reviews]);

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="My reviews" onBack={() => history.push('/coach/dashboard')} />
      </div>

      <PageBody refreshable>
        <QueryState
          isLoading={profileQuery.isPending || reviewsQuery.isPending}
          error={reviewsQuery.error}
          onRetry={() => void reviewsQuery.refetch()}
        >
          {reviews.length === 0 ? (
            <EmptyState
              illustration="reviews"
              title="No reviews yet"
              message="Athletes can review a session once you have marked it complete."
            />
          ) : (
            <>
              <AppCard style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 34, color: 'var(--cl-ink)', lineHeight: 1.1 }}>
                    {(profile?.rating ?? 0).toFixed(1)}
                  </div>
                  <div style={{ fontSize: 13 }}><RatingStar /></div>
                  <div style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', marginTop: 2 }}>
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
                <Distribution counts={counts} total={reviews.length} />
              </AppCard>

              {reviews.map((r) => (
                <AppCard key={r.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <InitialsAvatar
                      initials={initialsOf(r.athleteName.split(' ')[0], r.athleteName.split(' ')[1])}
                      src={r.athleteImage}
                      size={36} radius={11} fontSize={13}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--cl-ink)' }}>
                        {r.athleteName}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', marginTop: 1 }}>
                        {formatShortDate(r.createdAt)}
                      </div>
                    </div>
                    <StarRating value={r.rating} size={14} />
                  </div>
                  {r.comment && (
                    <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--cl-muted-3)', margin: '11px 0 0' }}>
                      {r.comment}
                    </p>
                  )}
                </AppCard>
              ))}
            </>
          )}

          <div style={{ height: 24 }} />
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default ReviewsPage;
