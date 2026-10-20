import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewSummary from '@/components/reviews/ReviewSummary';
import { AppPage, EmptyState, PageBody, PageHeader, QueryState } from '@/components/ui';
import { useCoachReviews, useMyCoachProfile } from '@/hooks';

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
              <ReviewSummary rating={profile?.rating ?? 0} reviews={reviews} />
              {reviews.map((r) => <ReviewCard key={r.id} review={r} style={{ marginBottom: 10 }} />)}
            </>
          )}

          <div style={{ height: 24 }} />
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default ReviewsPage;
