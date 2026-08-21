import React from 'react';

export type IllustrationName =
  | 'coaches'
  | 'search'
  | 'bookings'
  | 'requests'
  | 'notifications'
  | 'wallet'
  | 'reviews'
  | 'calendar'
  | 'unbuilt';

/**
 * Inline SVG rather than image files: the project ships no binary assets, and
 * drawing with theme tokens means these follow a palette change in
 * variables.css instead of needing re-exporting.
 */
const PAPER = 'var(--cl-surface)';
const LINE = 'var(--cl-muted-line)';
const INK = 'var(--cl-ink)';
const ACCENT = 'var(--cl-accent)';
const SUBTLE = 'var(--cl-subtle)';

const shapes: Record<IllustrationName, React.ReactNode> = {
  coaches: (
    <>
      <circle cx="60" cy="40" r="16" fill={SUBTLE} stroke={LINE} strokeWidth="2" />
      <path d="M34 84c0-14 12-22 26-22s26 8 26 22" fill={PAPER} stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="92" cy="52" r="11" fill={PAPER} stroke={LINE} strokeWidth="2" />
      <path d="M76 84c0-10 8-16 16-16s16 6 16 16" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="52" r="11" fill={PAPER} stroke={LINE} strokeWidth="2" />
      <path d="M12 84c0-10 8-16 16-16" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  search: (
    <>
      <circle cx="54" cy="50" r="26" fill={PAPER} stroke={LINE} strokeWidth="2.5" />
      <path d="M73 69l17 17" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 50h20M54 40v20" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  bookings: (
    <>
      <rect x="22" y="26" width="76" height="66" rx="10" fill={PAPER} stroke={LINE} strokeWidth="2.5" />
      <path d="M22 44h76" stroke={LINE} strokeWidth="2.5" />
      <path d="M40 20v12M80 20v12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <rect x="36" y="56" width="18" height="14" rx="4" fill={SUBTLE} />
      <rect x="62" y="56" width="22" height="4" rx="2" fill={LINE} />
      <rect x="62" y="66" width="14" height="4" rx="2" fill={LINE} />
    </>
  ),
  requests: (
    <>
      <rect x="20" y="30" width="80" height="56" rx="10" fill={PAPER} stroke={LINE} strokeWidth="2.5" />
      <path d="M20 40l40 26 40-26" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="92" cy="34" r="10" fill={ACCENT} />
    </>
  ),
  notifications: (
    <>
      <path d="M60 24c-13 0-22 10-22 23 0 18-6 22-6 26h56c0-4-6-8-6-26 0-13-9-23-22-23z" fill={PAPER} stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 79a10 10 0 0020 0" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 18v6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  wallet: (
    <>
      <rect x="20" y="34" width="80" height="52" rx="10" fill={PAPER} stroke={LINE} strokeWidth="2.5" />
      <path d="M20 50h80" stroke={LINE} strokeWidth="2.5" />
      <circle cx="82" cy="68" r="7" fill={SUBTLE} stroke={LINE} strokeWidth="2" />
      <path d="M32 30l44-8" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  reviews: (
    <path
      d="M60 26l9 19 21 3-15 15 4 21-19-10-19 10 4-21-15-15 21-3z"
      fill={PAPER}
      stroke={LINE}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <>
      <rect x="22" y="28" width="76" height="64" rx="10" fill={PAPER} stroke={LINE} strokeWidth="2.5" />
      <path d="M22 46h76" stroke={LINE} strokeWidth="2.5" />
      <path d="M40 22v12M80 22v12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="62" r="4" fill={LINE} />
      <circle cx="60" cy="62" r="4" fill={ACCENT} />
      <circle cx="76" cy="62" r="4" fill={LINE} />
      <circle cx="44" cy="78" r="4" fill={LINE} />
      <circle cx="60" cy="78" r="4" fill={LINE} />
    </>
  ),
  unbuilt: (
    <>
      <rect x="24" y="40" width="72" height="50" rx="10" fill={PAPER} stroke={LINE} strokeWidth="2.5" />
      <path d="M40 40V32a20 20 0 0140 0v8" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="62" r="6" fill={SUBTLE} stroke={LINE} strokeWidth="2" />
      <path d="M60 68v8" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
};

const EmptyIllustration: React.FC<{ name: IllustrationName; size?: number }> = ({ name, size = 120 }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 120 102" fill="none" aria-hidden="true">
    {shapes[name]}
  </svg>
);

export default EmptyIllustration;
