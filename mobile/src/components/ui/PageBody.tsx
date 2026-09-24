import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';

import Spinner from './Spinner';

/** How far it must be dragged to count, and how far it will ever stretch. */
const THRESHOLD = 64;
const MAX_PULL = 96;
/** Drag feels tethered rather than loose, and cannot outrun the screen. */
const RESISTANCE = 0.5;

interface PageBodyProps {
  children: React.ReactNode;
  /** Bottom padding — raise it on pages with a sticky footer or tab bar. */
  pb?: number;
  style?: React.CSSProperties;
  /**
   * Pull-to-refresh, refetching whatever this screen is currently showing.
   * One word per page, because the alternative — naming each page's queries by
   * hand — is a list that silently rots as pages gain and lose data.
   */
  refreshable?: boolean;
  /** For a screen that needs something beyond refetching its own queries. */
  onRefresh?: () => Promise<unknown> | void;
}

/**
 * Scrollable middle region between a fixed header and an optional sticky footer.
 *
 * The pull gesture is hand-rolled rather than Ionic's IonRefresher, which only
 * hooks into IonContent's own scroller — and AppPage sets scrollY={false},
 * because this div is the scroller that makes the sticky-footer layout work.
 * Putting the gesture here means every page gets it from one prop.
 */
const PageBody: React.FC<PageBodyProps> = ({
  children, pb = 12, style, refreshable = false, onRefresh,
}) => {
  const qc = useQueryClient();
  const scroller = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Active queries only: refresh what is on screen, not every cache this
  // session has ever filled.
  const refresh = useCallback(
    () => (onRefresh ? onRefresh() : qc.refetchQueries({ type: 'active' })),
    [onRefresh, qc],
  );

  const enabled = refreshable || Boolean(onRefresh);
  const armed = enabled && !refreshing;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only from the very top, or the gesture would fight ordinary scrolling.
    if (!armed || (scroller.current?.scrollTop ?? 0) > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    // Dragging back up hands control straight back to the scroller.
    if (delta <= 0) {
      startY.current = null;
      setPull(0);
      return;
    }
    setPull(Math.min(MAX_PULL, delta * RESISTANCE));
  };

  const handleTouchEnd = async () => {
    startY.current = null;
    if (pull < THRESHOLD) {
      setPull(0);
      return;
    }
    // Held open at the threshold so the spinner does not flash and vanish on a
    // fast connection.
    setRefreshing(true);
    setPull(THRESHOLD);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
      setPull(0);
    }
  };

  return (
    <div
      ref={scroller}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: pb,
        // Stops the webview's own rubber-banding competing with the drag.
        overscrollBehaviorY: enabled ? 'contain' : undefined,
        ...style,
      }}
    >
      {enabled && (
        <div
          aria-hidden={pull === 0}
          style={{
            height: pull,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Snaps back under its own steam once the finger is gone; follows
            // the finger exactly while it is down.
            transition: startY.current === null ? 'height .25s ease' : undefined,
          }}
        >
          <Spinner
            size={20}
            style={{
              opacity: Math.min(1, pull / THRESHOLD),
              // Winds up as it is dragged, then spins for real once released.
              animation: refreshing ? undefined : 'none',
              transform: refreshing ? undefined : `rotate(${pull * 4}deg)`,
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
};

export default PageBody;
