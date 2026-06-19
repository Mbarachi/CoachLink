import { IonButtons, IonBackButton, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

interface AppPageHeaderProps {
  title?: string;
  backHref?: string;
  showBack?: boolean;
  end?: React.ReactNode;
}

const AppPageHeader: React.FC<AppPageHeaderProps> = ({
  title,
  backHref,
  showBack = true,
  end,
}) => (
  <IonHeader style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}>
    <IonToolbar
      style={
        {
          '--background': 'var(--cl-background)',
          '--border-width': '0',
          '--padding-start': '8px',
          '--padding-end': '8px',
        } as React.CSSProperties
      }
    >
      {showBack && (
        <IonButtons slot="start">
          <IonBackButton
            defaultHref={backHref || '/welcome'}
            text=""
            style={{ color: 'var(--cl-text-main)' }}
          />
        </IonButtons>
      )}
      {title && (
        <IonTitle
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: 18,
            color: 'var(--cl-text-main)',
          }}
        >
          {title}
        </IonTitle>
      )}
      {end && <IonButtons slot="end">{end}</IonButtons>}
    </IonToolbar>
  </IonHeader>
);

export default AppPageHeader;
