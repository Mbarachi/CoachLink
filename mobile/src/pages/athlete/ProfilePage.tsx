import { IonIcon } from '@ionic/react';
import { createOutline, settingsOutline } from 'ionicons/icons';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage, InitialsAvatar, PageBody, PageTitle, StatusPill } from '@/components/ui';
import { useBookingRequests, useMyReviewedBookings } from '@/hooks';
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
  const reviewed = useMyReviewedBookings().data ?? [];
  const stats = useMemo(() => [
    { val: String(requests.filter(r => r.status === 'ACCEPTED').length), label: 'Sessions' },
    { val: String(new Set(requests.map(r => r.coachId)).size), label: 'Coaches' },
    { val: String(reviewed.length), label: 'Reviews' },
  ], [requests, reviewed]);

  // About you, and the way to Settings. Bookings has its own tab, the bell on
  // Home opens notifications, and Help & FAQ sits under Settings, so listing
  // them here as well only made the page longer.
  const menuItems = [
    // Ionicons outline, the set the tab bar uses.
    { label: 'Edit profile', icon: createOutline,   action: () => history.push('/athlete/profile/edit') },
    { label: 'Settings',     icon: settingsOutline, action: () => history.push('/athlete/settings') },
  ];

  return (
    <AppPage padding="screen">
      <PageBody refreshable pb={96}>
        {/* No gear here: the Settings row below says the same, with a label. */}
        <PageTitle style={{ margin: '8px 0 18px' }}>Profile</PageTitle>

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
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--cl-subtle)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IonIcon icon={item.icon} aria-hidden="true" style={{ fontSize: 17, color: 'var(--cl-ink)' }} />
              </div>
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
