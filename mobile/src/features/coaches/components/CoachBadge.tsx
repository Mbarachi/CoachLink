import React from 'react';

type BadgeVariant = 'sport' | 'verified' | 'venue' | 'experience';

interface CoachBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  sport: {
    background: '#e6f7f5',
    color: 'var(--cl-primary)',
    border: '1px solid #b2e8df',
  },
  verified: {
    background: '#e8f4ff',
    color: 'var(--cl-accent)',
    border: '1px solid #b3d6f7',
  },
  venue: {
    background: '#f4f6f9',
    color: 'var(--cl-text-light)',
    border: '1px solid var(--cl-border)',
  },
  experience: {
    background: '#fff8ec',
    color: 'var(--cl-warning)',
    border: '1px solid #fce3a2',
  },
};

const CoachBadge: React.FC<CoachBadgeProps> = ({ label, variant = 'sport' }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 11,
      fontWeight: 500,
      borderRadius: 20,
      padding: '3px 10px',
      whiteSpace: 'nowrap',
      ...VARIANT_STYLES[variant],
    }}
  >
    {variant === 'verified' && (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    )}
    {label}
  </span>
);

export default CoachBadge;
