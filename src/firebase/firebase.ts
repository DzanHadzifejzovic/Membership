import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// ---------------------------------------------------------------------------
// PASTE YOUR FIREBASE CONFIG HERE (or, preferably, set the VITE_FIREBASE_*
// values in a local .env file — see .env.example — and leave this as is).
//
// Firebase Console → Project settings → General → Your apps → SDK setup and
// configuration → "Config".
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

export const app = initializeApp(firebaseConfig)

// getAuth() validates the API key synchronously and throws if it's missing,
// which would otherwise crash the whole app before .env is filled in.
export const auth = isFirebaseConfigured
  ? getAuth(app)
  : (null as unknown as Auth)
export const db = isFirebaseConfigured
  ? getFirestore(app)
  : (null as unknown as Firestore)
