import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Initialised lazily so a missing config fails with something readable rather
 * than at import time. These values are public identifiers by design —
 * security rules and the role checks inside callable functions are the actual
 * access control.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const REGION = import.meta.env.VITE_FIREBASE_REGION ?? 'europe-west1';

let app: FirebaseApp | null = null;

function ensureApp(): FirebaseApp {
  if (!app) {
    if (!config.projectId) {
      throw new Error(
        'Firebase is not configured. Copy mobile/.env.example to mobile/.env and restart the dev server.',
      );
    }
    app = initializeApp(config);
  }
  return app;
}

export const firebaseAuth = (): Auth => getAuth(ensureApp());
export const firebaseDb = (): Firestore => getFirestore(ensureApp());
export const firebaseFunctions = (): Functions => getFunctions(ensureApp(), REGION);
export const firebaseStorage = (): FirebaseStorage => getStorage(ensureApp());
