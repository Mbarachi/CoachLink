import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewSummary from '@/components/reviews/ReviewSummary';
import { AppPage, EmptyState, PageBody, PageHeader, QueryState } from '@/components/ui';
import { useCoach, useCoachReviews } from '@/hooks';
import { coachName } from '@/lib/coach';

/**
 * Every review of one coach, for someone deciding whether to book them. The
 * coach page shows the newest few in a row; this is where "See all" lands.
 */
const CoachReviewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const coach = useCoach(id);
  const reviewsQuery = useCoachReviews(id);
  const reviews = useMemo(() => reviewsQuery.data ?? [], [reviewsQuery.data]);

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title={coach.data ? `${coachName(coach.data)}'s reviews` : 'Reviews'} />
      </div>

      <PageBody refreshable>
        <QueryState
          isLoading={reviewsQuery.isPending}
          error={reviewsQuery.error}
          onRetry={() => void reviewsQuery.refetch()}
        >
          {reviews.length === 0 ? (
            <EmptyState
              illustration="reviews"
              title="No reviews yet"
              message="Reviews appear here once athletes have completed sessions with this coach."
            />
          ) : (
            <>
              <ReviewSummary rating={coach.data?.profile.rating ?? 0} reviews={reviews} />
              {reviews.map((r) => <ReviewCard key={r.id} review={r} style={{ marginBottom: 10 }} />)}
            </>
          )}

          <div style={{ height: 24 }} />
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default CoachReviewsPage;
