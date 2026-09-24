import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, EmptyState, FilePicker, FormLabel, InitialsAvatar,
  LoadingOverlay, PageBody, PageHeader, QueryState, SectionHeading, StatusPill, StickyFooter,
} from '@/components/ui';
import { useMyCoachProfile, useResubmitCoachProfile } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { coachInitials } from '@/lib/coach';
import { uploadCoachFiles } from '@/services/firebase/uploads';
import { useUiStore } from '@/store/ui.store';

/**
 * Answering a rejection, on its own screen.
 *
 * Kept apart from profile management on purpose: editing a bio and clearing a
 * rejection are different jobs with different stakes, and burying the second
 * inside the first hid the only thing standing between a coach and earning.
 * One job, one screen, one button.
 *
 * The admin's reason opens the screen rather than sitting back on the dashboard,
 * so the coach reads why they were turned down with the two pickers that answer
 * it already in view.
 */
const ResubmitPage: React.FC = () => {
  const history = useHistory();
  const showToast = useUiStore((s) => s.showToast);
  const query = useMyCoachProfile();
  const coach = query.data;

  const resubmit = useResubmitCoachProfile(coach?.profile.id);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const busy = uploading || resubmit.isPending;

  const submit = async () => {
    if (!photoFile || !idFile) return;
    setUploading(true);
    try {
      const uploads = await uploadCoachFiles(photoFile, idFile);
      setUploading(false);
      await resubmit.mutateAsync(uploads);
      showToast('Sent back for review. We will let you know the outcome.', 'success');
      history.replace('/coach/dashboard');
    } catch (err) {
      setUploading(false);
      showToast(getErrorMessage(err));
    }
  };

  return (
    <AppPage padding="screen">
      <LoadingOverlay
        show={busy}
        label={uploading ? 'Uploading your documents…' : 'Sending for review…'}
        hint={uploading ? 'Keep the app open — this can take a moment on a slow connection.' : undefined}
      />

      <div style={{ flexShrink: 0 }}>
        <PageHeader title="My profile" />
      </div>

      <PageBody refreshable>
        <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
          {!coach ? null : coach.profile.verificationStatus !== 'REJECTED' ? (
            /* Nothing to answer — they arrived by a stale link or the back button. */
            <EmptyState
              illustration="coaches"
              title="Nothing to resubmit"
              message={
                coach.profile.verificationStatus === 'APPROVED'
                  ? 'Your profile is approved and athletes can book you.'
                  : 'Your profile is already with an admin.'
              }
              action={
                <AppButton onClick={() => history.replace('/coach/dashboard')}>
                  Back to dashboard
                </AppButton>
              }
            />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <InitialsAvatar
                  initials={coachInitials(coach)}
                  src={coach.profileImage}
                  size={62}
                  radius={18}
                  fontSize={19}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <StatusPill tone="destructive">Rejected</StatusPill>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '8px 0 0' }}>
                    Your profile was turned down. Replace your photo and ID below to have it
                    looked at again.
                  </p>
                </div>
              </div>

              <AppCard padding={16} style={{ marginTop: 20 }}>
                <SectionHeading style={{ margin: '0 0 11px', fontSize: 15, fontWeight: 800 }}>
                  Why your profile was turned down
                </SectionHeading>

                <div style={{
                  background: 'var(--cl-destructive-bg)', borderRadius: 12, padding: '12px 14px',
                  fontSize: 13, lineHeight: 1.45, color: 'var(--cl-muted-3)',
                }}>
                  {coach.profile.verificationNote?.trim()
                    || 'No reason was recorded. Upload a clear photo and a valid government-issued ID.'}
                </div>

                {/* The server refuses a resubmission that is byte-for-byte what it
                    already turned down, so the constraint is said up front. */}
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--cl-muted-1)', margin: '14px 0 0' }}>
                  Upload both again to send your profile back for review. At least one has to be
                  different from what was turned down.
                </p>

                <FormLabel style={{ margin: '20px 0 8px' }}>
                  Profile photo <span style={{ color: 'var(--cl-destructive)' }}>*</span>
                </FormLabel>
                <FilePicker
                  value={photoFile}
                  onChange={setPhotoFile}
                  accept={['image/jpeg', 'image/png', 'image/webp']}
                  maxBytes={5 * 1024 * 1024}
                  allowCamera
                  hint="JPEG or PNG, up to 5MB"
                />

                <FormLabel style={{ margin: '20px 0 8px' }}>
                  Government-issued ID <span style={{ color: 'var(--cl-destructive)' }}>*</span>
                </FormLabel>
                <FilePicker
                  value={idFile}
                  onChange={setIdFile}
                  accept={['image/jpeg', 'image/png', 'application/pdf']}
                  maxBytes={5 * 1024 * 1024}
                  allowCamera
                  shape="wide"
                  hint="Photo or PDF. Reviewed by an admin, never shown to athletes."
                />
              </AppCard>

              <StickyFooter>
                <AppButton
                  onClick={() => void submit()}
                  disabled={!photoFile || !idFile}
                  loading={busy}
                  loadingLabel={uploading ? 'Uploading…' : 'Sending…'}
                  style={{ width: '100%' }}
                >
                  Send back for review
                </AppButton>
              </StickyFooter>
            </>
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default ResubmitPage;
