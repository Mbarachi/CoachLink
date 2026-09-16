import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton,
  AppInput,
  AppPage,
  ChoiceChip,
  EmptyState,
  FormLabel,
  PageBody,
  PageHeader,
  QueryState,
  StatusPill,
  StickyFooter,
} from '@/components/ui';
import { useMyCoachProfile, useSports, useUpdateCoachProfile } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { initialsOf } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const labelStyle: React.CSSProperties = { margin: '15px 0 7px' };

const ProfileManagementPage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const showToast = useUiStore((s) => s.showToast);
  const initials = initialsOf(user?.firstName, user?.lastName);

  const profileQuery = useMyCoachProfile();
  const coach = profileQuery.data;
  const sportsQuery = useSports();
  const update = useUpdateCoachProfile(coach?.profile.id);

  const [sportIds, setSportIds] = useState<string[]>([]);
  const [venue, setVenue] = useState('');
  const [rate, setRate] = useState('');
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState('');

  // Seed the form once the profile arrives; edits after that are the user's.
  useEffect(() => {
    if (!coach) return;
    setSportIds(coach.sports.map((s) => s.id));
    setVenue(coach.profile.venue);
    setRate(String(coach.profile.sessionRate));
    setAbout(coach.profile.bio);
    setExperience(String(coach.profile.yearsOfExperience));
  }, [coach]);

  const toggleSport = (id: string) =>
    setSportIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const save = async () => {
    if (sportIds.length === 0) {
      showToast('Pick at least one sport.', 'warning');
      return;
    }
    try {
      await update.mutateAsync({
        bio: about.trim(),
        venue: venue.trim(),
        sessionRate: Number(rate.replace(/[^\d]/g, '')),
        yearsOfExperience: Number(experience) || 0,
        sportIds,
      });
      showToast('Profile saved.', 'success');
      history.push('/coach/settings');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not save your profile.'), 'danger');
    }
  };

  // A coach who hasn't onboarded yet has no profile to manage.
  const noProfile = profileQuery.isError;

  return (
    <AppPage padding="screen">
      <div style={{ flexShrink: 0 }}>
        <PageHeader title="My profile" />
      </div>

      <PageBody>
        {noProfile ? (
          <EmptyState
            illustration="unbuilt"
            title="No coach profile yet"
            message="Finish coach onboarding to create the profile athletes will see."
            action={
              <AppButton size="md" fullWidth={false} onClick={() => history.push('/auth/coach-onboarding')}>
                Set up my profile
              </AppButton>
            }
          />
        ) : (
          <QueryState isLoading={profileQuery.isPending} error={null}>
            {!coach ? null : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <div style={{
                    width: 66, height: 66, borderRadius: 20, flexShrink: 0,
                    backgroundImage: 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 9px, var(--cl-photo-dark-2) 9px 18px)',
                    display: 'flex', alignItems: 'flex-end',
                  }}>
                    <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-accent)', padding: '6px 8px' }}>{initials}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <StatusPill status={coach.profile.verificationStatus} />
                    {coach.profile.verificationStatus !== 'APPROVED' && (
                      <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 6 }}>
                        {coach.profile.verificationStatus === 'PENDING'
                          ? 'Athletes can see you once an admin approves your profile.'
                          : 'Your profile was rejected. Update it and it will be reviewed again.'}
                      </div>
                    )}
                  </div>
                </div>

                <FormLabel style={{ ...labelStyle, marginTop: 18 }}>Sports you coach</FormLabel>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(sportsQuery.data ?? []).map(s => (
                    <ChoiceChip
                      key={s.id}
                      active={sportIds.includes(s.id)}
                      onClick={() => toggleSport(s.id)}
                      style={{ padding: '10px 18px' }}
                    >{s.icon} {s.name}</ChoiceChip>
                  ))}
                </div>

                <AppInput label="Training venue" value={venue} onChange={setVenue} labelStyle={labelStyle} />

                <AppInput label="Years of experience" type="number" value={experience} onChange={setExperience} labelStyle={labelStyle} />

                <AppInput label="Price per session (₦)" type="number" value={rate} onChange={setRate} labelStyle={labelStyle} />
                <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 7 }}>Recommended: ₦5,000 – ₦15,000</div>

                <FormLabel style={labelStyle}>About</FormLabel>
                <textarea
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  style={{ width: '100%', height: 84, borderRadius: 'var(--cl-radius-input)', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 16, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                />

                <div style={{ height: 90 }} />
              </>
            )}
          </QueryState>
        )}
      </PageBody>

      {coach && (
        <StickyFooter style={{ paddingLeft: 0, paddingRight: 0 }}>
          <AppButton size="md" loading={update.isPending}
            loadingLabel="Saving…" onClick={() => void save()}>
            Save profile
          </AppButton>
        </StickyFooter>
      )}
    </AppPage>
  );
};

export default ProfileManagementPage;
