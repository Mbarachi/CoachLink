import React from 'react';

export type PillTone = 'pending' | 'accent' | 'success' | 'neutral';

const TONES: Record<PillTone, React.CSSProperties> = {
  pending: { background: 'var(--cl-pending-bg)', color: 'var(--cl-pending-text)' },
  accent: { background: 'var(--cl-accent)', color: 'var(--cl-on-accent)' },
  success: { background: 'var(--cl-success-bg)', color: 'var(--cl-success-text)' },
  neutral: { background: 'var(--cl-subtle)', color: 'var(--cl-muted-1)' },
};

/**
 * Single source of truth for how a booking/request status is coloured. Keyed
 * uppercase because that is what the API returns; lookups normalise, so
 * "Pending" and "PENDING" resolve the same.
 */
export const STATUS_TONES: Record<string, PillTone> = {
  PENDING: 'pending',
  NEW: 'accent',
  ACCEPTED: 'accent',
  CONFIRMED: 'success',
  COMPLETED: 'neutral',
  CANCELLED: 'neutral',
  DECLINED: 'neutral',
  EXPIRED: 'neutral',
  UPCOMING: 'accent',
};

/** "PENDING" -> "Pending"; anything already prettified is left alone. */
export const statusLabel = (status: string) =>
  status === status.toUpperCase()
    ? status.charAt(0) + status.slice(1).toLowerCase()
    : status;

interface StatusPillProps {
  /** A known status colours itself; pass `tone` for anything else. */
  status?: string;
  tone?: PillTone;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const StatusPill: React.FC<StatusPillProps> = ({ status, tone, children, style }) => {
  const resolved = tone ?? (status ? STATUS_TONES[status.toUpperCase()] ?? 'neutral' : 'neutral');

  return (
    <span
      style={{
        fontSize: 11, fontWeight: 700, padding: '5px 10px',
        borderRadius: 'var(--cl-radius-chip)', whiteSpace: 'nowrap',
        ...TONES[resolved],
        ...style,
      }}
    >
      {children ?? (status ? statusLabel(status) : null)}
    </span>
  );
};

export default StatusPill;
