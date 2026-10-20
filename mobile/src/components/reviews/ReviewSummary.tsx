import React, { useMemo } from 'react';

import { AppCard, RatingStar } from '@/components/ui';
import type { Review } from '@/types';

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

/** The average beside the spread of scores behind it. */
const ReviewSummary: React.FC<{ rating: number; reviews: Review[] }> = ({ rating, reviews }) => {
  const counts = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    for (const r of reviews) {
      if (r.rating >= 1 && r.rating <= 5) buckets[r.rating - 1] += 1;
    }
    return buckets;
  }, [reviews]);

  return (
    <AppCard style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14 }}>
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 34, color: 'var(--cl-ink)', lineHeight: 1.1 }}>
          {rating.toFixed(1)}
        </div>
        <div style={{ fontSize: 13 }}><RatingStar /></div>
        <div style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', marginTop: 2 }}>
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </div>
      </div>
      <Distribution counts={counts} total={reviews.length} />
    </AppCard>
  );
};

export default ReviewSummary;
