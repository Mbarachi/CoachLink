import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, InitialsAvatar, PageBody, PageTitle, StatusPill } from '@/components/ui';
import { useBookingRequests } from '@/hooks';
import { fullName, initialsOf } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const name = fullName(user?.firstName, user?.lastName);
  const email = user?.email ?? '';
  const initials = initialsOf(user?.firstName, user?.lastName);
  const roleLabel = user?.role === 'PARENT' ? 'Parent' : 'Athlete';

  const requests = useBookingRequests().data ?? [];
  const stats = useMemo(() => [
    { val: String(requests.filter(r => r.status === 'ACCEPTED').length), label: 'Sessions' },
    { val: String(new Set(requests.map(r => r.coachId)).size), label: 'Coaches' },
    // Reviews need their own module before this can be anything but zero.
    { val: '0', label: 'Reviews' },
  ], [requests]);

  const menuItems = [
    { label: 'My bookings',     action: () => history.push('/athlete/bookings') },
    { label: 'Payment methods', action: () => {} },
    { label: 'Notifications',   action: () => history.push('/athlete/notifications') },
    { label: 'Settings',        action: () => history.push('/athlete/settings') },
  ];

  return (
    <AppPage padding="screen">
      <PageBody pb={96}>
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
          {stats.map(s => (
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
      </PageBody>
    </AppPage>
  );
};

export default ProfilePage;
