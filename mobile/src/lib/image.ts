/** Long edge of a stored profile photo. An avatar renders at 54px; a listing
 *  row at 46. 800 leaves room for a full-bleed header on a 3x screen and
 *  nothing beyond it. */
const MAX_EDGE = 800;
const QUALITY = 0.85;

/**
 * Shrinks a photo before it is uploaded.
 *
 * Phone cameras produce 3–5MB files, and the coach listing renders dozens of
 * them at 46px. Without this every athlete browsing the list downloads several
 * megabytes to draw thumbnails — on Lagos mobile data, which is the whole
 * market. Done here rather than in a Cloud Function because the bytes should
 * never leave the phone in the first place.
 *
 * Returns the original if anything fails: a photo that uploads large beats a
 * signup that dies on a canvas quirk.
 */
export async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 400_000) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', QUALITY);
    });
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
