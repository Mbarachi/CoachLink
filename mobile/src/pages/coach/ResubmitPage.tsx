import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, EmptyState, FilePicker, FormLabel,
  LoadingOverlay, PageBody, PageHeader, QueryState, StickyFooter,
} from '@/components/ui';
import { useMyCoachProfile, useResubmitCoachProfile } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { uploadCoachFiles } from '@/services/firebase/uploads';
import { useUiStore } from '@/store/ui.store';

/**
 * Answering a rejection, on its own screen.
 *
 * Kept apart from profile management on purpose: editing a bio and clearing a
 * rejection are different jobs with different stakes, and burying the second
 * inside the first hid the only thing standing between a coach and earning.
 * One job, one screen, one button.
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
        <PageHeader title="Resubmit for review" />
      </div>

      <PageBody>
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
              <AppCard padding={15} style={{ borderRadius: 16, background: 'var(--cl-subtle)', border: 'none' }}>
                <div style={{ fontSize: 12, color: 'var(--cl-muted-1)', fontWeight: 600, letterSpacing: '.02em' }}>
                  WHY IT WAS TURNED DOWN
                </div>
                <div style={{ fontSize: 14, color: 'var(--cl-ink)', marginTop: 7, lineHeight: 1.45 }}>
                  {coach.profile.verificationNote?.trim()
                    || 'No reason was recorded. Upload a clear photo and a valid government-issued ID.'}
                </div>
              </AppCard>

              <div style={{ fontSize: 13, color: 'var(--cl-muted-3)', margin: '18px 0 2px', lineHeight: 1.45 }}>
                Upload both again. At least one has to be different from what was
                turned down — sending back the same files will be refused.
              </div>

              <FormLabel style={{ margin: '18px 0 8px' }}>
                Profile photo <span style={{ color: 'var(--cl-accent)' }}>*</span>
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
                Government-issued ID <span style={{ color: 'var(--cl-accent)' }}>*</span>
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
