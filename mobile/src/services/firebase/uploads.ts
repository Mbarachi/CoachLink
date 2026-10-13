import { getDownloadURL, ref, uploadBytesResumable, type StorageReference } from 'firebase/storage';

import { UserFacingError } from '@/lib/apiError';
import { firebaseAuth, firebaseStorage } from '@/lib/firebase';
import { downscaleImage } from '@/lib/image';

const MAX_PROFILE_BYTES = 5 * 1024 * 1024;
// Matches storage.rules, which refuse anything at or over 5MB. The app used to
// allow 10, so a 6MB ID passed here and was then rejected by the server.
const MAX_ID_BYTES = 5 * 1024 * 1024;

/** Enough to read the small print on an ID card, at a fraction of the bytes. */
const ID_MAX_EDGE = 2000;

function requireUid(): string {
  const uid = firebaseAuth().currentUser?.uid;
  if (!uid) throw new UserFacingError('You must be signed in to upload.');
  return uid;
}

/** Keeps the original extension so the admin's browser renders it correctly. */
function extensionOf(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,5}$/.test(fromName)) return fromName;
  return file.type === 'application/pdf' ? 'pdf' : 'jpg';
}

export interface CoachUploads {
  profileImage: string;
  idDocumentPath: string;
}

/**
 * Copies a picked file into memory before it is uploaded.
 *
 * On Android a file from the gallery or camera is a handle onto the phone's
 * storage, not the bytes themselves, and Firebase uploads in slices. Reading
 * slices of such a handle can fail inside the app's WebView, and each failure
 * looks like a network error, so Firebase retried until "max retry time
 * exceeded" while the bar sat still. Desktop browsers never show this. Reading
 * the whole file once, up front, either works or fails at once with a reason.
 */
async function intoMemory(file: File, what: string): Promise<Uint8Array> {
  try {
    return new Uint8Array(await file.arrayBuffer());
  } catch (err) {
    // The error's name says why the phone refused, which is the one detail
    // worth having when someone reports this.
    const why = err instanceof Error ? ` (${err.name})` : '';
    throw new UserFacingError(`We couldn't read your ${what} from the phone${why}. Please choose it again.`);
  }
}

/** Uploads one file's bytes, reporting how many have been sent. */
function upload(
  target: StorageReference,
  bytes: Uint8Array,
  contentType: string,
  onBytes: (sent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(target, bytes, { contentType });
    task.on('state_changed', (snap) => onBytes(snap.bytesTransferred), reject, () => resolve());
  });
}

/**
 * The profile photo is world-readable, so a download URL is fine and lets
 * every listing render it directly. The ID document is not: only its storage
 * path is kept, and reading it goes through rules that admit an admin alone.
 * Minting a download URL for the ID would create a shareable link to a
 * government document that outlives any permission check.
 *
 * onProgress hears one percentage across both files, so a slow connection
 * shows as a number creeping up rather than a spinner that could be stuck.
 * One file at a time: on a weak mobile signal two uploads only slow each
 * other down.
 */
export async function uploadCoachFiles(
  photo: File,
  idDocument: File,
  onProgress?: (percent: number) => void,
): Promise<CoachUploads> {
  const uid = requireUid();

  if (photo.size > MAX_PROFILE_BYTES) {
    throw new UserFacingError('That photo is over 5MB. Please choose a smaller one.');
  }
  if (idDocument.size > MAX_ID_BYTES) {
    throw new UserFacingError('That document is over 5MB. Please choose a smaller one.');
  }
  if (!photo.type.startsWith('image/')) {
    throw new UserFacingError('Your profile photo must be an image.');
  }
  if (!idDocument.type.startsWith('image/') && idDocument.type !== 'application/pdf') {
    throw new UserFacingError('Your ID must be an image or a PDF.');
  }

  // Checked at the size they chose, stored at the size we need. A phone
  // camera's ID photo is 3MB of mostly nothing; a PDF is left alone.
  const [smallPhoto, smallId] = await Promise.all([
    downscaleImage(photo),
    downscaleImage(idDocument, ID_MAX_EDGE),
  ]);

  const photoRef = ref(firebaseStorage(), `coaches/${uid}/profile/photo.${extensionOf(smallPhoto)}`);
  const idRef = ref(firebaseStorage(), `coaches/${uid}/id/document.${extensionOf(smallId)}`);

  const photoBytes = await intoMemory(smallPhoto, 'profile photo');
  const idBytes = await intoMemory(smallId, 'ID document');

  const total = photoBytes.byteLength + idBytes.byteLength;
  const sent = { photo: 0, id: 0 };
  const report = () => onProgress?.(Math.min(100, Math.round(((sent.photo + sent.id) / total) * 100)));
  report();

  await upload(photoRef, photoBytes, smallPhoto.type, (n) => { sent.photo = n; report(); });
  await upload(idRef, idBytes, smallId.type || 'application/octet-stream', (n) => { sent.id = n; report(); });

  return {
    profileImage: await getDownloadURL(photoRef),
    idDocumentPath: idRef.fullPath,
  };
}
