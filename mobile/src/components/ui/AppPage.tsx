import { IonContent, IonPage } from '@ionic/react';
import React from 'react';

const PADDING = {
  none: undefined,
  auth: '0 var(--cl-px-auth)',
  screen: '0 var(--cl-px)',
  hero: '0 34px',
} as const;

interface AppPageProps {
  children: React.ReactNode;
  /** Scrollable pages grow past the viewport; fixed ones fill it exactly. */
  scrollable?: boolean;
  padding?: keyof typeof PADDING;
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
          padding: PADDING[padding],
          fontFamily: 'var(--cl-font-body)',
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
