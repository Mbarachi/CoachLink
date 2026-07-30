import { IonIcon } from '@ionic/react';
import { alertCircle, checkmarkCircle, closeCircle, informationCircle } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

import type { Toast } from '@/store/ui.store';
import { useUiStore } from '@/store/ui.store';

const ICONS: Record<NonNullable<Toast['color']>, string> = {
  success: checkmarkCircle,
  warning: alertCircle,
  danger: closeCircle,
  primary: informationCircle,
};

const ICON_COLORS: Record<NonNullable<Toast['color']>, string> = {
  success: 'var(--cl-success-text)',
  warning: 'var(--cl-pending-text)',
  danger: '#e8836a',
  primary: 'var(--cl-accent)',
};

const DISPLAY_MS = 3500;
const EXIT_MS = 250;

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const dismissToast = useUiStore(s => s.dismissToast);
  const [visible, setVisible] = useState(false);
  const color = toast.color ?? 'primary';

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const hideTimer = setTimeout(() => setVisible(false), DISPLAY_MS);
    const removeTimer = setTimeout(() => dismissToast(toast.id), DISPLAY_MS + EXIT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, dismissToast]);

  return (
    <div
      onClick={() => dismissToast(toast.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        background: 'var(--cl-ink)', color: 'var(--cl-surface)',
        padding: '13px 18px', borderRadius: 'var(--cl-radius-chip)',
        boxShadow: '0 12px 28px rgba(0,0,0,.28)',
        fontFamily: 'var(--cl-font-body)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.35,
        maxWidth: 340, cursor: 'pointer', pointerEvents: 'auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-14px)',
        transition: `opacity ${EXIT_MS}ms ease, transform ${EXIT_MS}ms ease`,
      }}
    >
      <IonIcon icon={ICONS[color]} style={{ fontSize: 18, color: ICON_COLORS[color], flexShrink: 0 }} />
      <span>{toast.message}</span>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const toasts = useUiStore(s => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 'max(env(safe-area-inset-top), 14px)', left: 0, right: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      zIndex: 99999, pointerEvents: 'none', padding: '0 20px',
    }}>
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
};

export default ToastContainer;
