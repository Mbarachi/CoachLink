import React from 'react';

import { AppCard, InitialsAvatar, StarRating } from '@/components/ui';
import { formatShortDate, initialsOf } from '@/lib/format';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
  /** Cut the comment to this many lines, for cards in a row of equal height. */
  clampLines?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/** One athlete's review: who, when, the stars, and what they said. */
const ReviewCard: React.FC<ReviewCardProps> = ({ review: r, clampLines, onClick, style }) => {
  const [first, last] = r.athleteName.split(' ');
  return (
    <AppCard onClick={onClick} style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <InitialsAvatar initials={initialsOf(first, last)} src={r.athleteImage} size={36} radius={11} fontSize={13} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--cl-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.athleteName}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', marginTop: 1 }}>
            {formatShortDate(r.createdAt)}
          </div>
        </div>
        <StarRating value={r.rating} size={14} />
      </div>
      {r.comment && (
        <p style={{
          fontSize: 13.5, lineHeight: 1.55, color: 'var(--cl-muted-3)', margin: '11px 0 0',
          ...(clampLines ? {
            display: '-webkit-box', WebkitLineClamp: clampLines, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } : {}),
        }}>
          {r.comment}
        </p>
      )}
    </AppCard>
  );
};

export default ReviewCard;
