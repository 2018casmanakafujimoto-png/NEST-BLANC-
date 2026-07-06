import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebase";

/** Email/password sign-in. Returns the signed-in user's uid. */
export async function signInAdmin(email: string, password: string): Promise<string> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebaseが設定されていません。");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user.uid;
}

export async function signOutAdmin(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

/** Admin membership is a doc's existence in the `adminUsers` collection, keyed by uid. */
export async function isAdminUser(uid: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;
  const snapshot = await getDoc(doc(db, "adminUsers", uid));
  return snapshot.exists();
}

/** Subscribes to auth state; calls back with null immediately if Firebase isn't configured. */
export function subscribeAuthState(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
