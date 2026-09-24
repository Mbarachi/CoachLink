import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { firebaseAuth, firebaseStorage } from '@/lib/firebase';
import { downscaleImage } from '@/lib/image';

const MAX_PROFILE_BYTES = 5 * 1024 * 1024;
const MAX_ID_BYTES = 10 * 1024 * 1024;

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
export async function uploadCoachFiles(photo: File, idDocument: File): Promise<CoachUploads> {
  const uid = requireUid();

  if (photo.size > MAX_PROFILE_BYTES) {
    throw new Error('That photo is over 5MB. Please choose a smaller one.');
  }
  if (idDocument.size > MAX_ID_BYTES) {
    throw new Error('That document is over 10MB. Please choose a smaller one.');
  }
  if (!photo.type.startsWith('image/')) {
    throw new Error('Your profile photo must be an image.');
  }
  if (!idDocument.type.startsWith('image/') && idDocument.type !== 'application/pdf') {
    throw new Error('Your ID must be an image or a PDF.');
  }

  // Checked at the size they chose, stored at the size we need: the 5MB limit
  // above is about what they may pick, not what every listing row downloads.
  const shrunk = await downscaleImage(photo);

  const photoRef = ref(firebaseStorage(), `coaches/${uid}/profile/photo.${extensionOf(shrunk)}`);
  await uploadBytes(photoRef, shrunk, { contentType: shrunk.type });

  const idRef = ref(firebaseStorage(), `coaches/${uid}/id/document.${extensionOf(idDocument)}`);
  await uploadBytes(idRef, idDocument, { contentType: idDocument.type });

  return {
    profileImage: await getDownloadURL(photoRef),
    idDocumentPath: idRef.fullPath,
  };
}
