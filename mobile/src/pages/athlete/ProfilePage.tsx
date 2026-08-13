import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, InitialsAvatar, PageBody, PageTitle, StatusBar, StatusPill } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const STATS = [
  { val: '8', label: 'Sessions' },
  { val: '3', label: 'Coaches' },
  { val: '5', label: 'Reviews' },
];

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const name = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Ada Obi' : 'Ada Obi';
  const email = user?.email ?? 'ada@example.com';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AO';
  const roleLabel = user?.role === 'PARENT' ? 'Parent' : 'Athlete';

  const menuItems = [
    { label: 'My bookings',     action: () => history.push('/athlete/bookings') },
    { label: 'Payment methods', action: () => {} },
    { label: 'Notifications',   action: () => history.push('/athlete/notifications') },
    { label: 'Settings',        action: () => history.push('/athlete/settings') },
  ];

  return (
    <AppPage padding="screen">
      <PageBody pb={96}>
        <StatusBar />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 18px' }}>
          <PageTitle style={{ margin: 0 }}>Profile</PageTitle>
          <button onClick={() => history.push('/athlete/settings')} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 16, cursor: 'pointer' }}>⚙</button>
        </div>

        {/* avatar + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <InitialsAvatar initials={initials} size={66} radius={20} fontSize={24} />
          <div>
            <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>{name}</div>
            <div style={{ fontSize: 13, color: 'var(--cl-muted-1)' }}>{email}</div>
            <StatusPill tone="accent" style={{ display: 'inline-block', marginTop: 6, padding: '3px 10px' }}>{roleLabel}</StatusPill>
          </div>
        </div>

        {/* stat tiles */}
        <div style={{ display: 'flex', gap: 9, marginTop: 18 }}>
          {STATS.map(s => (
            <AppCard key={s.label} padding={14} style={{ flex: 1, borderRadius: 15, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 20, color: 'var(--cl-ink)' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--cl-muted-1)', marginTop: 2 }}>{s.label}</div>
            </AppCard>
          ))}
        </div>

        {/* menu list */}
        <AppCard padding={0} style={{ marginTop: 20, overflow: 'hidden' }}>
          {menuItems.map((item, i) => (
            <div key={item.label} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 15, borderBottom: i < menuItems.length - 1 ? '1px solid var(--cl-subtle)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--cl-subtle)', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cl-ink)' }}>{item.label}</span>
              <span style={{ color: 'var(--cl-muted-line)' }}>›</span>
            </div>
          ))}
        </AppCard>

        {/* switch to coach view */}
        <div onClick={() => history.push('/coach/dashboard')} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 11, background: 'var(--cl-ink)', borderRadius: 16, padding: 15, cursor: 'pointer' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--cl-accent)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--cl-surface)' }}>Switch to coach view</span>
          <span style={{ color: 'var(--cl-accent)' }}>›</span>
        </div>
      </PageBody>
    </AppPage>
  );
};

export default ProfilePage;
