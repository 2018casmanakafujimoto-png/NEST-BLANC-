import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { AxisScores, TYPE_IDS, TypeId } from "@/types/quiz";
import { MARRIED_AVERAGE_VECTORS_DEFAULT } from "@/data/cms-defaults";

// Repository Pattern for the Firestore "stats" collection: per-type average
// axis vectors among married members, used for the 成婚女性類似度 feature.
// Falls back to the bundled defaults when Firestore isn't configured.

const STATS_COLLECTION = "stats";

export async function getMarriedAverageVector(typeId: TypeId): Promise<AxisScores> {
  const db = getFirestoreDb();
  if (!db) return MARRIED_AVERAGE_VECTORS_DEFAULT[typeId];
  try {
    const snapshot = await getDoc(doc(db, STATS_COLLECTION, typeId));
    return snapshot.exists() ? (snapshot.data() as AxisScores) : MARRIED_AVERAGE_VECTORS_DEFAULT[typeId];
  } catch (error) {
    console.warn(`Firestore read failed for stats/${typeId}; using bundled default.`, error);
    return MARRIED_AVERAGE_VECTORS_DEFAULT[typeId];
  }
}

export async function setMarriedAverageVector(typeId: TypeId, vector: AxisScores): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.info(`Firebase is not configured; skipping stats write for type "${typeId}".`);
    return;
  }
  await setDoc(doc(db, STATS_COLLECTION, typeId), vector);
}

/** Convenience for the admin CMS page: all four types' vectors in one call. */
export async function getAllMarriedAverageVectors(): Promise<Record<TypeId, AxisScores>> {
  const entries = await Promise.all(TYPE_IDS.map(async (id) => [id, await getMarriedAverageVector(id)] as const));
  return Object.fromEntries(entries) as Record<TypeId, AxisScores>;
}

export async function setAllMarriedAverageVectors(value: Record<TypeId, AxisScores>): Promise<void> {
  await Promise.all(TYPE_IDS.map((id) => setMarriedAverageVector(id, value[id])));
}
