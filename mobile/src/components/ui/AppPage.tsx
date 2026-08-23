import { IonContent, IonPage } from '@ionic/react';
import React from 'react';

const PADDING_X = {
  none: '0px',
  auth: 'var(--cl-px-auth)',
  screen: 'var(--cl-px)',
  hero: '34px',
} as const;

/**
 * Clears the notch and status bar on device. The inset is 0 in a desktop
 * browser, so the constant keeps a little breathing room there too. This
 * replaces the mock 9:41 status bar the mockups used, which double-drew over
 * the real one on a device.
 */
const TOP_INSET = 'calc(env(safe-area-inset-top, 0px) + 12px)';

interface AppPageProps {
  children: React.ReactNode;
  /** Scrollable pages grow past the viewport; fixed ones fill it exactly. */
  scrollable?: boolean;
  padding?: keyof typeof PADDING_X;
  /** Centres content both axes — used by the success/confirmation screens. */
  center?: boolean;
  background?: string;
}

const AppPage: React.FC<AppPageProps> = ({
  children,
  scrollable = false,
  padding = 'none',
  center = false,
  background = 'var(--cl-canvas)',
}) => (
  <IonPage>
    <IonContent scrollY={scrollable} style={{ '--background': background } as React.CSSProperties}>
      <div
        style={{
          [scrollable ? 'minHeight' : 'height']: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: TOP_INSET,
          paddingLeft: PADDING_X[padding],
          paddingRight: PADDING_X[padding],
          fontFamily: 'var(--cl-font-body)',
          boxSizing: 'border-box',
          ...(center
            ? { alignItems: 'center', justifyContent: 'center', textAlign: 'center' as const }
            : {}),
        }}
      >
        {children}
      </div>
    </IonContent>
  </IonPage>
);

export default AppPage;
