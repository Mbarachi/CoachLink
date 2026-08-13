import React from 'react';

export type PillTone = 'pending' | 'accent' | 'success' | 'neutral';

const TONES: Record<PillTone, React.CSSProperties> = {
  pending: { background: 'var(--cl-pending-bg)', color: 'var(--cl-pending-text)' },
  accent: { background: 'var(--cl-accent)', color: 'var(--cl-on-accent)' },
  success: { background: 'var(--cl-success-bg)', color: 'var(--cl-success-text)' },
  neutral: { background: 'var(--cl-subtle)', color: 'var(--cl-muted-1)' },
};

/** Single source of truth for how a booking/request status is coloured. */
export const STATUS_TONES: Record<string, PillTone> = {
  Pending: 'pending',
  New: 'accent',
  Accepted: 'accent',
  Confirmed: 'success',
  Completed: 'neutral',
  Cancelled: 'neutral',
  Declined: 'neutral',
};

interface StatusPillProps {
  /** A known status colours itself; pass `tone` for anything else. */
  status?: string;
  tone?: PillTone;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const StatusPill: React.FC<StatusPillProps> = ({ status, tone, children, style }) => {
  const resolved = tone ?? (status ? STATUS_TONES[status] ?? 'neutral' : 'neutral');

  return (
    <span
      style={{
        fontSize: 11, fontWeight: 700, padding: '5px 10px',
        borderRadius: 'var(--cl-radius-chip)', whiteSpace: 'nowrap',
        ...TONES[resolved],
        ...style,
      }}
    >
      {children ?? status}
    </span>
  );
};

export default StatusPill;
