import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton,
  AppCard,
  AppPage,
  ListRow,
  PageBody,
  PageTitle,
  SectionLabel,
  Toggle,
} from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const groupStyle: React.CSSProperties = { borderRadius: 16, overflow: 'hidden', marginBottom: 18 };

const CoachSettingsPage: React.FC = () => {
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
        <PageTitle>Settings</PageTitle>
      </div>

      <PageBody pb={22}>
        <SectionLabel>ACCOUNT</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ListRow label="Edit profile" onClick={() => history.push('/coach/profile')} />
          <ListRow label="Email & password" />
          <ListRow label="Payout account" last />
        </AppCard>

        <SectionLabel>PREFERENCES</SectionLabel>
        <AppCard padding={0} style={groupStyle}>
          <ListRow label="Push notifications" right={<Toggle on={push} onChange={() => setPush(!push)} />} />
          <ListRow label="Email updates" right={<Toggle on={email} onChange={() => setEmail(!email)} />} />
          <ListRow label="New request alerts" right={<Toggle on={remind} onChange={() => setRemind(!remind)} />} last />
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

export default CoachSettingsPage;
