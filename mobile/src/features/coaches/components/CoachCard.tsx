import React from 'react';
import { useHistory } from 'react-router-dom';

import { Coach } from '../types/coach.types';
import CoachBadge from './CoachBadge';
import PriceTag from './PriceTag';
import RatingDisplay from './RatingDisplay';

interface CoachCardProps {
  coach: Coach;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  const history = useHistory();
  const fullName = `${coach.firstName} ${coach.lastName}`;

  return (
    <div
      style={{
        background: 'var(--cl-surface)',
        borderRadius: 16,
        border: '1px solid var(--cl-border)',
        padding: 16,
        marginBottom: 14,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top row: avatar + info */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        <img
          src={coach.profileImage}
          alt={fullName}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--cl-border)',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + verified */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--cl-text-main)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {coach.firstName} {coach.lastName}
            </span>
            {coach.isVerified && (
              <CoachBadge label="Verified" variant="verified" />
            )}
          </div>

          {/* Badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
            <CoachBadge label={coach.sport} variant="sport" />
            <CoachBadge label={coach.venue} variant="venue" />
          </div>

          {/* Rating */}
          <RatingDisplay rating={coach.rating} reviewCount={coach.reviewCount} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--cl-border)', marginBottom: 12 }} />

      {/* Bottom row: price + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PriceTag amount={coach.sessionRate} size="sm" />
        <button
          onClick={() => history.push(`/athlete/coaches/${coach.id}`)}
          style={{
            background: 'var(--cl-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '8px 18px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default CoachCard;
