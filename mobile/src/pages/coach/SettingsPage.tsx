import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton,
  AppCard,
  AppPage,
  ListRow,
  PageBody,
  PageTitle,
  SectionLabel,
  ThemeChoice,
  Toggle,
} from '@/components/ui';
import { usePushToggle } from '@/hooks';
import { useAuthStore } from '@/store/auth.store';

const groupStyle: React.CSSProperties = { borderRadius: 16, overflow: 'hidden', marginBottom: 18 };

const CoachSettingsPage: React.FC = () => {
  const history = useHistory();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const push = usePushToggle();

  const handleLogout = () => {
    clearAuth();
    history.replace('/welcome');
  };

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageTitle>Settings</PageTitle>
      </div>

      <PageBody pb={22}>
        <SectionLabel>ACCOUNT</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ListRow label="Edit profile" onClick={() => history.push('/coach/profile')} />
          <ListRow label="My availability" onClick={() => history.push('/coach/availability')} />
          <ListRow label="My reviews" onClick={() => history.push('/coach/reviews')} />
          <ListRow label="Payout account" onClick={() => history.push('/coach/earnings')} last />
        </AppCard>

        <SectionLabel>PREFERENCES</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ThemeChoice />
          {/* Only on a device: in a browser there is no push to turn off, and a
              switch that does nothing is worse than no switch. Email updates
              and request alerts are gone for the same reason — nothing sent
              either, so the rows were promises. */}
          {push.supported && (
            <ListRow
              label="Push notifications"
              right={<Toggle on={push.on} onChange={() => void push.toggle()} />}
              last
            />
          )}
        </AppCard>

        <SectionLabel>SUPPORT</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ListRow label="Help & FAQ" onClick={() => history.push('/help')} />
          <ListRow label="Privacy & terms" onClick={() => history.push('/legal')} last />
        </AppCard>

        <AppButton variant="destructive" onClick={handleLogout} style={{ height: 52, fontSize: 14.5 }}>
          Log out
        </AppButton>
      </PageBody>
    </AppPage>
  );
};

export default CoachSettingsPage;
