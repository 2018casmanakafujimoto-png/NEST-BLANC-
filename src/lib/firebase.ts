import { initializeApp, getApps, FirebaseOptions } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { AxisScores, TypeId } from "@/types/quiz";

// All values come from env vars only. Never hardcode Firebase credentials here.
// Required at deploy time (see .env.example):
//   NEXT_PUBLIC_FIREBASE_API_KEY
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID
//   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//   NEXT_PUBLIC_FIREBASE_APP_ID
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

if (!isConfigured && typeof window !== "undefined") {
  console.warn(
    "[firebase] NEXT_PUBLIC_FIREBASE_* env vars are not set. Firebase-backed features " +
      "(CMS content, diagnosis result save, admin login) will use local defaults / no-op. " +
      "Copy .env.example to .env.local and fill in your Firebase project config to enable them."
  );
}

function getDb() {
  if (!isConfigured) return null;
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getFirestore(app);
}

/** Shared Firestore handle for repositories (src/repositories/*). Null when unconfigured. */
export function getFirestoreDb() {
  return getDb();
}

function getApp() {
  if (!isConfigured) return null;
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

/** Shared Auth handle (src/lib/adminAuth.ts). Null when Firebase env vars aren't set. */
export function getFirebaseAuth(): Auth | null {
  const app = getApp();
  return app ? getAuth(app) : null;
}

/** Shared Storage handle. Null when Firebase env vars aren't set. */
export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getApp();
  return app ? getStorage(app) : null;
}

export interface DiagnosisResultRecord {
  typeId: TypeId;
  scores: AxisScores;
  createdAt: string;
}

/**
 * Persists a diagnosis result to Firestore. No-ops (and logs nothing sensitive)
 * when Firebase env vars aren't set, so the quiz flow works fully offline/local
 * during development.
 */
export async function saveResultToFirestore(record: DiagnosisResultRecord): Promise<void> {
  const db = getDb();
  if (!db) {
    console.info("Firebase is not configured; skipping result save.");
    return;
  }
  await addDoc(collection(db, "diagnosisResults"), record);
}
