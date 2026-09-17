import React from 'react';

export type SportBannerName = 'tennis' | 'swimming' | 'default';

/**
 * Inline SVG for the same reason EmptyIllustration is: no binary assets, and
 * the scenes follow a palette change in variables.css rather than needing
 * re-exporting. Drawn wide and sliced, so one viewBox covers any phone width.
 */
const LINE = 'var(--cl-court-line)';

/** A coach's sport comes back as a display name, so match loosely. */
export const sportBannerFor = (sport?: string | null): SportBannerName => {
  const s = (sport ?? '').toLowerCase();
  if (s.includes('tennis')) return 'tennis';
  if (s.includes('swim')) return 'swimming';
  return 'default';
};

const scenes: Record<SportBannerName, React.ReactNode> = {
  // A clay court from the baseline. The surface is the palette's own
  // terracotta, which is what a clay court actually looks like.
  tennis: (
    <>
      <rect width="400" height="236" fill="var(--cl-sport-tennis)" />
      <rect width="400" height="96" fill="var(--cl-sport-tennis-2)" />
      <path d="M128 96h144l68 140H60z" fill="var(--cl-sport-tennis-2)" opacity=".45" />
      <path d="M128 96h144l68 140H60z" fill="none" stroke={LINE} strokeWidth="2.5" />
      <path d="M150 134h100l18 44H132z" fill="none" stroke={LINE} strokeWidth="2" />
      <path d="M200 134v44M94 178h212" stroke={LINE} strokeWidth="2" />
      <path d="M92 60h216" stroke={LINE} strokeWidth="3" />
      <path d="M92 60v34M308 60v34" stroke={LINE} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M92 74h216" stroke={LINE} strokeWidth="1.5" opacity=".65" />
      <circle cx="322" cy="150" r="11" fill="var(--cl-sport-ball)" />
      <path d="M313 144c7 4 11 10 11 17M331 144c-7 4-11 10-11 17" fill="none" stroke={LINE} strokeWidth="1.5" opacity=".8" />
    </>
  ),
  // Lanes from the blocks end. The alternating floats are what makes a lane
  // rope read as a lane rope rather than a dashed line.
  swimming: (
    <>
      <rect width="400" height="236" fill="var(--cl-sport-swim)" />
      {/* floor markings, one down the middle of each lane */}
      {[94, 142, 190].map((y) => (
        <path key={y} d={`M0 ${y}h400`} stroke="var(--cl-sport-swim-2)" strokeWidth="9" opacity=".55" />
      ))}
      {/* surface highlights */}
      {[110, 158, 206].map((y) => (
        <path key={y} d={`M0 ${y}q30 -7 60 0t60 0 60 0 60 0 60 0 60 0 60 0`} fill="none" stroke={LINE} strokeWidth="1.5" opacity=".18" />
      ))}
      {/* lane ropes */}
      {[70, 118, 166, 214].map((y) => (
        <g key={y}>
          <path d={`M0 ${y}h400`} stroke="var(--cl-sport-swim-2)" strokeWidth="1.5" opacity=".7" />
          {Array.from({ length: 25 }, (_, i) => (
            <circle
              key={i}
              cx={i * 16 + 4}
              cy={y}
              r="3.2"
              fill={i % 2 ? LINE : 'var(--cl-accent)'}
              opacity=".8"
            />
          ))}
        </g>
      ))}
      {/* deck and starting blocks */}
      <rect width="400" height="34" fill="var(--cl-sport-deck)" />
      <path d="M0 34h400" stroke="var(--cl-sport-swim-2)" strokeWidth="2" />
      {[46, 150, 254, 358].map((x) => (
        <g key={x}>
          <path d={`M${x} 29h30l-4 -13h-22z`} fill={LINE} opacity=".85" />
          <path d={`M${x + 4} 16h22`} stroke="var(--cl-sport-swim-2)" strokeWidth="2.5" />
        </g>
      ))}
    </>
  ),
  // Neither sport, or nothing loaded yet: the Clay stripes, not a guess.
  default: (
    <>
      <rect width="400" height="236" fill="var(--cl-subtle)" />
      <path
        d="M-60 236L180 -40M0 236L240 -40M60 236L300 -40M120 236L360 -40M180 236L420 -40M240 236L480 -40M-120 236L120 -40"
        stroke="var(--cl-border-alt)"
        strokeWidth="13"
      />
    </>
  ),
};

interface SportBannerProps {
  /** Display name of the coach's primary sport. */
  sport?: string | null;
  height?: number;
  /** Overlaid on the scene — the back button, a pill. */
  children?: React.ReactNode;
}

const SportBanner: React.FC<SportBannerProps> = ({ sport, height = 236, children }) => (
  <div style={{ position: 'relative', height, overflow: 'hidden' }}>
    <svg
      viewBox="0 0 400 236"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    >
      {scenes[sportBannerFor(sport)]}
    </svg>
    {/* Keeps the back button and the avatar's white edge legible whatever the
        scene does behind them. */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to bottom, rgba(36,28,19,.22) 0 64px, rgba(36,28,19,0) 120px, rgba(36,28,19,.16) 100%)',
    }} />
    {children}
  </div>
);

export default SportBanner;
