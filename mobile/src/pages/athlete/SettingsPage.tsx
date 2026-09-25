import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton,
  AppCard,
  AppPage,
  ListRow,
  PageBody,
  PageHeader,
  SectionLabel,
  ThemeChoice,
  Toggle,
} from '@/components/ui';
import { usePushToggle } from '@/hooks';
import { useAuthStore } from '@/store/auth.store';

const groupStyle: React.CSSProperties = { borderRadius: 16, overflow: 'hidden', marginBottom: 18 };

const SettingsPage: React.FC = () => {
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
        <PageHeader title="Settings" />
      </div>

      <PageBody pb={22}>
        <SectionLabel>ACCOUNT</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ListRow label="My bookings" onClick={() => history.push('/athlete/bookings')} />
          <ListRow label="Notifications" onClick={() => history.push('/athlete/notifications')} />
          {/* A fact, not an action: there is one launch area, and no chevron,
              because nothing happens when it is tapped. */}
          <ListRow label="Location" right={<span style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Amuwo Odofin</span>} last />
        </AppCard>

        <SectionLabel>PREFERENCES</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ThemeChoice />
          {/* Only on a device: in a browser there is no push to turn off. Email
              updates and booking reminders are gone — nothing sent either, so
              those switches were promises rather than settings. */}
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

export default SettingsPage;
