import React from 'react';

import { AppButton, AppCard } from '@/components/ui';
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
 */
const VerificationCard: React.FC<VerificationCardProps> = ({ coach, onFix }) => {
  if (!coach) return null;
  const { verificationStatus, verificationNote, submissionCount } = coach.profile;
  if (verificationStatus === 'APPROVED') return null;

  const rejected = verificationStatus === 'REJECTED';

  return (
    <AppCard
      padding={16}
      style={{
        marginTop: 16,
        borderRadius: 16,
        background: rejected ? 'var(--cl-surface)' : 'var(--cl-pending-bg)',
        border: `1px solid ${rejected ? 'var(--cl-destructive)' : 'transparent'}`,
      }}
    >
      <div style={{
        fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15.5,
        color: rejected ? 'var(--cl-destructive)' : 'var(--cl-pending-text)',
      }}>
        {rejected ? 'Your profile was turned down' : 'Your profile is with an admin'}
      </div>

      <div style={{ fontSize: 13, color: 'var(--cl-muted-3)', marginTop: 7, lineHeight: 1.45 }}>
        {rejected
          ? verificationNote?.trim() || 'No reason was recorded.'
          : submissionCount > 1
            ? 'You have sent it back for review. We will let you know the outcome.'
            : 'Athletes cannot see you or book you until it is approved.'}
      </div>

      {/* The one thing standing between them and earning, so it gets a button
          rather than leaving them to find Settings › Edit profile. */}
      {rejected && (
        <AppButton onClick={onFix} style={{ marginTop: 14, width: '100%' }}>
          Update and resubmit
        </AppButton>
      )}
    </AppCard>
  );
};

export default VerificationCard;
