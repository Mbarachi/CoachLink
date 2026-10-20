import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';

import { setBackOverride } from '@/lib/backNavigation';

interface BottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  /** A link on the right of the title, e.g. "Clear". */
  action?: { label: string; onClick: () => void };
  /** Pinned below the scrolling content, usually the confirm button. */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * A panel that rises from the bottom over a dimmed screen.
 *
 * Rendered into the body so it covers the tab bar too: inside the page it
 * would sit under it, with the tabs still tappable through the dim.
 */
const BottomSheet: React.FC<BottomSheetProps> = ({ open, title, onClose, action, footer, children }) => {
  const { pathname } = useLocation();

  // The phone's back button closes the sheet, rather than leaving the screen
  // with it still open.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    setBackOverride(pathname, () => closeRef.current());
    return () => setBackOverride(pathname, null);
  }, [open, pathname]);

  if (!open) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', fontFamily: 'var(--cl-font-body)' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(36, 28, 19, 0.45)' }} />
      <div
        role="dialog"
        aria-label={title}
        style={{ position: 'relative', maxHeight: '86%', display: 'flex', flexDirection: 'column', background: 'var(--cl-canvas)', borderRadius: '24px 24px 0 0' }}
      >
        <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--cl-muted-line)', margin: '10px auto 12px', flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--cl-px) 12px', borderBottom: '1px solid var(--cl-border)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 20, color: 'var(--cl-ink)' }}>{title}</span>
          {action && (
            <span onClick={action.onClick} style={{ fontWeight: 700, fontSize: 13, color: 'var(--cl-accent)', cursor: 'pointer' }}>
              {action.label}
            </span>
          )}
        </div>
        <div style={{ overflowY: 'auto', padding: '16px var(--cl-px)' }}>{children}</div>
        {footer && (
          <div style={{ flexShrink: 0, padding: '4px var(--cl-px) calc(env(safe-area-inset-bottom, 0px) + 22px)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default BottomSheet;
