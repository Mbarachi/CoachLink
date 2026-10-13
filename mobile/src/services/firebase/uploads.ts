import { getDownloadURL, ref, uploadBytesResumable, type StorageReference } from 'firebase/storage';

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
  if (!uid) throw new Error('You must be signed in to upload.');
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
 * The profile photo is world-readable, so a download URL is fine and lets
 * every listing render it directly. The ID document is not: only its storage
 * path is kept, and reading it goes through rules that admit an admin alone.
 * Minting a download URL for the ID would create a shareable link to a
 * government document that outlives any permission check.
 */
/** Uploads one file, reporting bytes sent so far. */
function upload(
  target: StorageReference,
  file: File,
  onBytes: (sent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(target, file, { contentType: file.type });
    task.on('state_changed', (snap) => onBytes(snap.bytesTransferred), reject, () => resolve());
  });
}

/**
 * Both files go up together, and onProgress hears the combined percentage,
 * so a slow connection shows as a number creeping up rather than a spinner
 * that could equally be stuck.
 */
export async function uploadCoachFiles(
  photo: File,
  idDocument: File,
  onProgress?: (percent: number) => void,
): Promise<CoachUploads> {
  const uid = requireUid();

  if (photo.size > MAX_PROFILE_BYTES) {
    throw new Error('That photo is over 5MB. Please choose a smaller one.');
  }
  if (idDocument.size > MAX_ID_BYTES) {
    throw new Error('That document is over 5MB. Please choose a smaller one.');
  }
  if (!photo.type.startsWith('image/')) {
    throw new Error('Your profile photo must be an image.');
  }
  if (!idDocument.type.startsWith('image/') && idDocument.type !== 'application/pdf') {
    throw new Error('Your ID must be an image or a PDF.');
  }

  // Checked at the size they chose, stored at the size we need. A phone
  // camera's ID photo is 3MB of mostly nothing; a PDF is left alone.
  const [smallPhoto, smallId] = await Promise.all([
    downscaleImage(photo),
    downscaleImage(idDocument, ID_MAX_EDGE),
  ]);

  const photoRef = ref(firebaseStorage(), `coaches/${uid}/profile/photo.${extensionOf(smallPhoto)}`);
  const idRef = ref(firebaseStorage(), `coaches/${uid}/id/document.${extensionOf(smallId)}`);

  const total = smallPhoto.size + smallId.size;
  const sent = { photo: 0, id: 0 };
  const report = () => onProgress?.(Math.min(100, Math.round(((sent.photo + sent.id) / total) * 100)));
  report();

  await Promise.all([
    upload(photoRef, smallPhoto, (n) => { sent.photo = n; report(); }),
    upload(idRef, smallId, (n) => { sent.id = n; report(); }),
  ]);

  return {
    profileImage: await getDownloadURL(photoRef),
    idDocumentPath: idRef.fullPath,
  };
}
