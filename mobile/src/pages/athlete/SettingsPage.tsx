import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton,
  AppCard,
  AppPage,
  ListRow,
  PageBody,
  PageHeader,
  SectionLabel,
  Toggle,
} from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const groupStyle: React.CSSProperties = { borderRadius: 16, overflow: 'hidden', marginBottom: 18 };

const SettingsPage: React.FC = () => {
  const history = useHistory();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [push, setPush]     = useState(true);
  const [email, setEmail]   = useState(false);
  const [remind, setRemind] = useState(true);

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
          <ListRow label="Edit profile" />
          <ListRow label="Email & password" />
          <ListRow label="Location" right={<span style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>Amuwo Odofin ›</span>} last />
        </AppCard>

        <SectionLabel>PREFERENCES</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ListRow label="Push notifications" right={<Toggle on={push} onChange={() => setPush(!push)} />} />
          <ListRow label="Email updates" right={<Toggle on={email} onChange={() => setEmail(!email)} />} />
          <ListRow label="Booking reminders" right={<Toggle on={remind} onChange={() => setRemind(!remind)} />} last />
        </AppCard>

        <SectionLabel>SUPPORT</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ListRow label="Help & FAQ" />
          <ListRow label="Privacy & terms" last />
        </AppCard>

        <AppButton variant="destructive" onClick={handleLogout} style={{ height: 52, fontSize: 14.5 }}>
          Log out
        </AppButton>
      </PageBody>
    </AppPage>
  );
};

export default SettingsPage;
