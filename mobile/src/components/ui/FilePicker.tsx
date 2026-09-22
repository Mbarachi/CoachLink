import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import React, { useEffect, useRef, useState } from 'react';

/** What a browser will actually render. HEIC from an iPhone will not. */
const PREVIEWABLE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface FilePickerProps {
  value: File | null;
  onChange: (file: File | null) => void;
  /** Accepted mime types. Anything outside this is rejected with a reason. */
  accept: string[];
  maxBytes: number;
  /** Offer the camera as well as the file picker. */
  allowCamera?: boolean;
  shape?: 'square' | 'wide';
  hint?: string;
}

const humanSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.ceil(bytes / 1024)}KB`;

const FilePicker: React.FC<FilePickerProps> = ({
  value, onChange, accept, maxBytes, allowCamera = false, shape = 'square', hint,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);

  /**
   * An object URL rather than a FileReader data URL: created instantly whatever
   * the file size, where reading a 10MB photo into base64 stalls the UI and can
   * exhaust memory on a mid-range phone.
   *
   * The previous URL is revoked when a new one replaces it, rather than in an
   * effect cleanup. Cleanup runs on every re-invocation — and React double-
   * invokes effects in development — which revoked the blob the <img> was
   * still decoding, leaving an empty preview.
   */
  useEffect(() => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
    if (!value || !PREVIEWABLE.includes(value.type)) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    objectUrl.current = url;
    setPreview(url);
  }, [value]);

  // No unmount cleanup on purpose. React double-invokes effects in
  // development, so an unmount revoke fires against the URL just created and
  // leaves a blank preview. At most one blob is held here and the browser
  // releases it when the document unloads — the wrong trade to chase.

  const accepts = (file: File) => {
    if (!accept.includes(file.type)) {
      // Names the actual problem: "image/*" lets a phone hand over HEIC, which
      // no browser will display and which would fail silently otherwise.
      const kind = file.type || 'that file type';
      setError(`${kind} isn't supported. Use a JPEG or PNG${accept.includes('application/pdf') ? ', or a PDF' : ''}.`);
      return false;
    }
    if (file.size > maxBytes) {
      setError(`That file is ${humanSize(file.size)}. The limit is ${humanSize(maxBytes)}.`);
      return false;
    }
    setError(null);
    return true;
  };

  const take = (file: File | null) => {
    if (!file) return;
    if (accepts(file)) onChange(file);
    else onChange(null);
  };

  const shoot = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        // Downscaled on the device: a full-resolution phone photo is several
        // megabytes of detail nobody needs for a 64px avatar, and it is the
        // upload that fails on a weak connection.
        width: 1200,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        // JPEG regardless of what the camera would otherwise produce.
        correctOrientation: true,
      });
      if (!photo.webPath) return;
      const blob = await (await fetch(photo.webPath)).blob();
      take(new File([blob], `photo.${photo.format || 'jpeg'}`, { type: blob.type || 'image/jpeg' }));
    } catch {
      // Cancelling the camera throws; that is not an error worth showing.
    }
  };

  const box = shape === 'square'
    ? { width: 64, height: 64, borderRadius: 18 }
    : { width: 96, height: 64, borderRadius: 14 };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          ...box, flexShrink: 0, overflow: 'hidden',
          background: 'var(--cl-subtle)',
          border: `1.5px ${value ? 'solid var(--cl-border)' : 'dashed var(--cl-muted-line)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {preview
            ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 10.5, color: 'var(--cl-muted-2)', textAlign: 'center', padding: 4 }}>
                {value ? 'No preview' : ''}
              </span>}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {allowCamera && Capacitor.isNativePlatform() && (
              <button
                type="button"
                onClick={() => void shoot()}
                style={{ border: '1.6px solid var(--cl-ink-fill)', background: 'var(--cl-ink-fill)', color: 'var(--cl-on-ink)', borderRadius: 12, padding: '9px 14px', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >Take photo</button>
            )}
            <button
              type="button"
              onClick={() => {
                // Cleared before opening, not after selecting: resetting the
                // input releases the File's backing store, which invalidates
                // any object URL made from it and blanks the preview. Doing it
                // here still allows re-picking the same file.
                if (inputRef.current) inputRef.current.value = '';
                inputRef.current?.click();
              }}
              style={{ border: '1.6px solid var(--cl-ink)', background: 'var(--cl-surface)', borderRadius: 12, padding: '9px 14px', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 13, color: 'var(--cl-ink)', cursor: 'pointer' }}
            >{value ? 'Change' : 'Choose file'}</button>
          </div>

          {value && !error && (
            <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value.name} · {humanSize(value.size)}
            </div>
          )}
          {!value && hint && !error && (
            <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 6 }}>{hint}</div>
          )}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: 12.5, color: 'var(--cl-destructive)', margin: '8px 0 0' }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        // Explicit types rather than image/*, so the picker itself filters out
        // formats that cannot be previewed or uploaded.
        accept={accept.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => take(e.target.files?.[0] ?? null)}
      />
    </>
  );
};

export default FilePicker;
