import React from 'react';

const Star: React.FC<{ filled: boolean; size: number }> = ({ filled, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5l1.11-6.47L2.6 9.45l6.5-.95L12 2.6z"
      fill={filled ? 'var(--cl-star)' : 'none'}
      stroke={filled ? 'var(--cl-star)' : 'var(--cl-muted-line)'}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

interface StarRatingProps {
  value: number;
  /** Omit to render a read-only score. */
  onChange?: (value: number) => void;
  size?: number;
}

/**
 * Five stars, tapped or read. The same component does both so a rating never
 * looks different on the form than it does on the review it produced.
 */
const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 30 }) => {
  const readOnly = !onChange;

  return (
    <div
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`${value} out of 5`}
      style={{ display: 'flex', gap: readOnly ? 2 : 8 }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        readOnly ? (
          <Star key={n} filled={n <= value} size={size} />
        ) : (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
            onClick={() => onChange(n)}
            style={{
              border: 'none', background: 'none', padding: 4, cursor: 'pointer',
              lineHeight: 0, borderRadius: 8,
            }}
          >
            <Star filled={n <= value} size={size} />
          </button>
        )
      ))}
    </div>
  );
};

export default StarRating;
