import React, { useEffect } from 'react';

import Spinner from './Spinner';

interface LoadingOverlayProps {
  show: boolean;
  /** What is happening. Silence on a blocking screen reads as a freeze. */
  label?: string;
  /** Shown under the label for operations that genuinely take a while. */
  hint?: string;
}

/**
 * Covers the screen while something slow and uninterruptible runs — an upload,
 * a redirect out to Paystack.
 *
 * Driven by a prop rather than global state on purpose: an overlay held in a
 * store survives the error path that forgot to clear it, and a stuck overlay
 * is worse than no overlay. Tied to the same boolean as the button, it cannot
 * disagree with what the screen is doing.
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, label = 'Working…', hint }) => {
  // Stop the page scrolling underneath while it is covered.
  useEffect(() => {
    if (!show) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [show]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 32,
        textAlign: 'center',
        // Tinted rather than black: the Clay canvas stays recognisable, so it
        // reads as the app being busy rather than a system dialog.
        background: 'rgba(36, 28, 19, 0.55)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
    >
      <div style={{
        background: 'var(--cl-surface)',
        borderRadius: 20,
        padding: '26px 28px',
        minWidth: 200,
        maxWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      }}>
        <Spinner size={30} />
        <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--cl-ink)' }}>
          {label}
        </div>
        {hint && (
          <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-1)' }}>{hint}</div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
