import React from 'react';
import { useHistory } from 'react-router-dom';

import { AppCard, AppPage } from '@/components/ui';
import type { UserRole } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { coachesService } from '@/services';

const roles = [
  {
    key: 'ATHLETE' as const,
    label: "I'm an athlete",
    sub: 'Find a coach and book my own sessions.',
    initial: 'A',
    iconBg: 'var(--cl-ink)',
    iconColor: 'var(--cl-accent)',
    selected: true,
    chevronColor: 'var(--cl-ink)',
    dest: '/auth/complete-profile',
  },
  {
    key: 'PARENT' as const,
    label: "I'm a parent",
    sub: 'Book sessions for my child.',
    initial: 'P',
    iconBg: 'var(--cl-subtle)',
    iconColor: 'var(--cl-ink)',
    selected: false,
    chevronColor: 'var(--cl-muted-1)',
    dest: '/auth/complete-profile',
  },
  {
    key: 'COACH' as const,
    label: "I'm a coach",
    sub: 'List my profile and accept bookings.',
    initial: 'C',
    iconBg: 'var(--cl-accent)',
    iconColor: 'var(--cl-on-accent)',
    selected: false,
    chevronColor: 'var(--cl-muted-1)',
    dest: '/auth/coach-onboarding',
  },
];

const RoleSelectionPage: React.FC = () => {
  const history = useHistory();
  const updateUser = useAuthStore((s) => s.updateUser);

  const pick = (r: typeof roles[0]) => {
    if (r.key === 'COACH') {
      // Not marked as a coach yet, on the phone or the server: that happens
      // when the profile is submitted. Marking it early is what sent a coach
      // who quit halfway onto a coach dashboard with no profile behind it.
      history.replace(r.dest);
      return;
    }
    updateUser({ role: r.key as UserRole });
    // Choosing the other side is giving up on the coach wizard, if one was started.
    void coachesService.discardDraft().catch(() => undefined);
    history.replace(r.dest);
  };

  return (
    <AppPage padding="auth">
      <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '30px 0 6px' }}>
        How will you<br />use CoachLink?
      </h1>
      <p style={{ fontSize: 14.5, color: 'var(--cl-muted-1)', margin: '0 0 26px' }}>You can change this later in settings.</p>

      {roles.map((r) => (
        <AppCard
          key={r.key}
          onClick={() => pick(r)}
          selected={r.selected}
          padding={18}
          style={{ display: 'flex', alignItems: 'center', gap: 15, borderRadius: 20, marginBottom: 13 }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: r.iconBg, color: r.iconColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 20,
          }}>{r.initial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)' }}>{r.label}</div>
            <div style={{ fontSize: 13, color: 'var(--cl-muted-1)', marginTop: 2 }}>{r.sub}</div>
          </div>
          <span style={{ fontSize: 20, color: r.chevronColor }}>›</span>
        </AppCard>
      ))}
    </AppPage>
  );
};

export default RoleSelectionPage;
