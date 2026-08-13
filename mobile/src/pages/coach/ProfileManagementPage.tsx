import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton, AppInput, AppPage, ChoiceChip, FormLabel,
  PageBody, PageHeader, StatusBar, StickyFooter,
} from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const SPORTS = ['Swimming', 'Tennis'];

const labelStyle: React.CSSProperties = { margin: '15px 0 7px' };

const ProfileManagementPage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const initials = ((user?.firstName?.[0] ?? 'T') + (user?.lastName?.[0] ?? 'A')).toUpperCase();

  const [name, setName]   = useState(`${user?.firstName ?? 'Tobi'} ${user?.lastName ?? 'Adebayo'}`);
  const [sport, setSport] = useState('Swimming');
  const [venue, setVenue] = useState('Festival Hotel Pool');
  const [price, setPrice] = useState('₦12,000');
  const [about, setAbout] = useState('Professional swimming coach with 5 years working with kids and adults at all levels.');

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <StatusBar />
        <PageHeader title="My profile" />
      </div>

      <PageBody>
        {/* photo + change button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div style={{
            width: 66, height: 66, borderRadius: 20, flexShrink: 0,
            backgroundImage: 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 9px, var(--cl-photo-dark-2) 9px 18px)',
            display: 'flex', alignItems: 'flex-end',
          }}>
            <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-accent)', padding: '6px 8px' }}>{initials}</span>
          </div>
          <AppButton variant="outline" fullWidth={false} style={{ height: 'auto', borderRadius: 12, padding: '10px 16px', fontSize: 13 }}>
            Change photo
          </AppButton>
        </div>

        <AppInput label="Full name" value={name} onChange={setName} labelStyle={{ ...labelStyle, marginTop: 18 }} />

        <FormLabel style={labelStyle}>Sport</FormLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          {SPORTS.map(s => (
            <ChoiceChip key={s} active={sport === s} onClick={() => setSport(s)} style={{ padding: '10px 18px' }}>{s}</ChoiceChip>
          ))}
        </div>

        <AppInput label="Training venue" value={venue} onChange={setVenue} labelStyle={labelStyle} />

        <AppInput label="Price per session" value={price} onChange={setPrice} labelStyle={labelStyle} />
        <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 7 }}>Recommended for {sport.toLowerCase()}: ₦5,000 – ₦15,000</div>

        <FormLabel style={labelStyle}>About</FormLabel>
        <textarea
          value={about}
          onChange={e => setAbout(e.target.value)}
          style={{ width: '100%', height: 84, borderRadius: 'var(--cl-radius-input)', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
        />

        <div style={{ height: 90 }} />
      </PageBody>

      <StickyFooter style={{ paddingLeft: 0, paddingRight: 0 }}>
        <AppButton size="md" onClick={() => history.push('/coach/settings')}>Save profile</AppButton>
      </StickyFooter>
    </AppPage>
  );
};

export default ProfileManagementPage;
