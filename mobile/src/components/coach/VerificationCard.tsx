import React from 'react';

import type { Coach } from '@/types';

interface VerificationCardProps {
  coach: Coach | undefined;
  onFix: () => void;
}

/**
 * Where a coach stands with verification, on the first screen they see.
 *
 * Only shown when it needs saying. An approved coach is the ordinary case and
 * gets a clean dashboard; being told "you are approved" every morning is noise
 * that trains people to ignore the space where the real message appears.
 *
 * A rejection is one tappable row rather than a card with its own button — the
 * whole banner is the target. The admin's reason has moved to the resubmit
 * screen, where it sits beside the two uploads that answer it; here it was only
 * a wall of text between the coach and the fix.
 */
const VerificationCard: React.FC<VerificationCardProps> = ({ coach, onFix }) => {
  if (!coach) return null;
  const { verificationStatus, submissionCount } = coach.profile;
  if (verificationStatus === 'APPROVED') return null;

  const rejected = verificationStatus === 'REJECTED';

  return (
    <div
      onClick={rejected ? onFix : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 18,
        padding: 14,
        borderRadius: 'var(--cl-radius-card)',
        background: rejected ? 'var(--cl-destructive-bg)' : 'var(--cl-pending-bg)',
        border: `1px solid ${rejected ? 'var(--cl-destructive-line)' : 'transparent'}`,
        cursor: rejected ? 'pointer' : 'default',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 18,
        background: rejected ? 'var(--cl-destructive)' : 'var(--cl-pending-text)',
        color: rejected ? 'var(--cl-on-destructive)' : 'var(--cl-pending-bg)',
      }}>!</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: 14,
          color: rejected ? 'var(--cl-destructive)' : 'var(--cl-pending-text)',
        }}>
          {rejected ? 'Profile turned down' : 'Your profile is with an admin'}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--cl-muted-1)', marginTop: 2 }}>
          {rejected
            ? 'Replace your photo and ID to get listed.'
            : submissionCount > 1
              ? 'You have sent it back for review. We will let you know the outcome.'
              : 'Athletes cannot see you or book you until it is approved.'}
        </div>
      </div>

      {/* Only the rejection goes anywhere, so only it gets the affordance. */}
      {rejected && (
        <span style={{ fontSize: 18, color: 'var(--cl-muted-line)', flexShrink: 0 }}>&rsaquo;</span>
      )}
    </div>
  );
};

export default VerificationCard;
