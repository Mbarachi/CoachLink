import { initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions, type Functions } from 'firebase/functions';
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage';

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

/**
 * Points every SDK at the local emulators instead of the live project.
 *
 * Opt-in through the environment rather than inferred from the hostname: the
 * dev server and the emulators are separate choices, and guessing wrong here
 * means either testing against nothing or writing test data into production.
 *
 * Each connect call is made once, on first use, because the SDK throws if it
 * is called after the service has issued a request.
 */
const USE_EMULATORS = import.meta.env.VITE_USE_EMULATORS === 'true';
const HOST = '127.0.0.1';

let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;
let storage: FirebaseStorage | null = null;

export const firebaseAuth = (): Auth => {
  if (!auth) {
    auth = getAuth(ensureApp());
    if (USE_EMULATORS) connectAuthEmulator(auth, `http://${HOST}:9099`, { disableWarnings: true });
  }
  return auth;
};

export const firebaseDb = (): Firestore => {
  if (!db) {
    db = getFirestore(ensureApp());
    if (USE_EMULATORS) connectFirestoreEmulator(db, HOST, 8080);
  }
  return db;
};

export const firebaseFunctions = (): Functions => {
  if (!functions) {
    functions = getFunctions(ensureApp(), REGION);
    if (USE_EMULATORS) connectFunctionsEmulator(functions, HOST, 5001);
  }
  return functions;
};

export const firebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    storage = getStorage(ensureApp());
    if (USE_EMULATORS) connectStorageEmulator(storage, HOST, 9199);
  }
  return storage;
};
