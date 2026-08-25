import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';

/**
 * Only initialised when VITE_BACKEND=firebase, so the Nest build never pays
 * for the SDK at runtime. These config values are public identifiers by
 * design — security rules and the role checks inside callable functions are
 * the actual access control.
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
        'Firebase is not configured. Set VITE_FIREBASE_* in mobile/.env, or run with VITE_BACKEND=nest.',
      );
    }
    app = initializeApp(config);
  }
  return app;
}

export const firebaseAuth = (): Auth => getAuth(ensureApp());
export const firebaseDb = (): Firestore => getFirestore(ensureApp());
export const firebaseFunctions = (): Functions => getFunctions(ensureApp(), REGION);
