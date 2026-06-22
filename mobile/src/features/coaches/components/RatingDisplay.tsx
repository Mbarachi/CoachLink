import React from 'react';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  size = 'sm',
}) => {
  const starSize = size === 'md' ? 16 : 13;
  const fontSize = size === 'md' ? 14 : 12;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} width={starSize} height={starSize} viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="var(--cl-warning)"
          />
        </svg>
      ))}
      {half && (
        <svg width={starSize} height={starSize} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="var(--cl-warning)" />
              <stop offset="50%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="url(#half-grad)"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} width={starSize} height={starSize} viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="#E2E8F0"
          />
        </svg>
      ))}
      <span
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize,
          fontWeight: 600,
          color: 'var(--cl-text-main)',
          marginLeft: 2,
        }}
      >
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize,
            color: 'var(--cl-text-light)',
          }}
        >
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
