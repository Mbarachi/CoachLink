import React, { useState } from 'react';

import { AppButton, AppCard, FilePicker, FormLabel, LoadingOverlay } from '@/components/ui';
import { useResubmitCoachProfile } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { uploadCoachFiles } from '@/services/firebase/uploads';
import { useUiStore } from '@/store/ui.store';
import type { Coach } from '@/types';

interface ResubmitPanelProps {
  coach: Coach;
}

/**
 * What a rejected coach does next.
 *
 * A rejection is answered by replacing the documents that caused it, not by
 * asking again, so both files are required here and the callable refuses the
 * request outright if neither has changed. Editing the rest of the profile —
 * bio, rate, venue — goes through the ordinary form below and does not reopen
 * a review.
 */
const ResubmitPanel: React.FC<ResubmitPanelProps> = ({ coach }) => {
  const showToast = useUiStore((s) => s.showToast);
  const resubmit = useResubmitCoachProfile(coach.profile.id);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const submit = async () => {
    if (!photoFile || !idFile) return;
    setUploading(true);
    try {
      const uploads = await uploadCoachFiles(photoFile, idFile);
      setUploading(false);
      await resubmit.mutateAsync(uploads);
      setPhotoFile(null);
      setIdFile(null);
      showToast('Sent back for review. We will let you know the outcome.');
    } catch (err) {
      setUploading(false);
      showToast(getErrorMessage(err));
    }
  };

  const busy = uploading || resubmit.isPending;

  return (
    <AppCard padding="16px" style={{ borderRadius: 16, marginTop: 16, border: '1px solid var(--cl-border-alt)' }}>
      <LoadingOverlay
        show={busy}
        label={uploading ? 'Uploading your documents…' : 'Sending for review…'}
        hint={uploading ? 'Keep the app open — this can take a moment on a slow connection.' : undefined}
      />

      <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 16, color: 'var(--cl-ink)' }}>
        Why your profile was turned down
      </div>
      <div style={{
        fontSize: 13.5, color: 'var(--cl-muted-3)', marginTop: 8, padding: '10px 12px',
        background: 'var(--cl-subtle)', borderRadius: 12, lineHeight: 1.45,
      }}>
        {coach.profile.verificationNote?.trim()
          || 'No reason was recorded. Please upload a clear photo and a valid government-issued ID.'}
      </div>

      <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', margin: '14px 0 2px' }}>
        Upload both again to send your profile back for review.
      </div>

      <FormLabel style={{ margin: '14px 0 8px' }}>
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

      <FormLabel style={{ margin: '18px 0 8px' }}>
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

      <AppButton
        onClick={() => void submit()}
        disabled={!photoFile || !idFile}
        loading={busy}
        loadingLabel={uploading ? 'Uploading…' : 'Sending…'}
        style={{ marginTop: 18, width: '100%' }}
      >
        Send back for review
      </AppButton>
    </AppCard>
  );
};

export default ResubmitPanel;
