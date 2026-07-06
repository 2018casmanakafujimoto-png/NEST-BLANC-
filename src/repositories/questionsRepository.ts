import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { Question } from "@/types/quiz";
import { questions as QUESTIONS_DEFAULT } from "@/data/questions";

// Repository Pattern for the Firestore "questions" collection, stored as a
// single doc ("all") holding the full ordered array — mirrors how the other
// CMS content is a single editable document. NOTE: the live /quiz page still
// reads the static src/data/questions.ts directly (unchanged, per the "don't
// touch the diagnosis flow" constraint); this repository only lets the admin
// CMS edit question content in Firestore without redeploying, ahead of that
// wiring being done in a future pass.

const QUESTIONS_COLLECTION = "questions";
const QUESTIONS_DOC_ID = "all";

export async function getQuestionsContent(): Promise<Question[]> {
  const db = getFirestoreDb();
  if (!db) return QUESTIONS_DEFAULT;
  const snapshot = await getDoc(doc(db, QUESTIONS_COLLECTION, QUESTIONS_DOC_ID));
  return snapshot.exists() ? (snapshot.data().items as Question[]) : QUESTIONS_DEFAULT;
}

export async function setQuestionsContent(items: Question[]): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.info("Firebase is not configured; skipping questions write.");
    return;
  }
  await setDoc(doc(db, QUESTIONS_COLLECTION, QUESTIONS_DOC_ID), { items });
}
