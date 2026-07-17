import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import {
  AICommentTemplateSet,
  CompatibilityFormulaWeights,
  HappinessWeights,
  MaleCompatibilityTable,
  MaleTypeId,
  MaleTypeProfile,
  MarriageStats,
  TypeId,
  TypeProfile,
} from "@/types/quiz";
import { TYPE_PROFILES, MALE_COMPATIBILITY_TABLE } from "@/data/types";
import { MALE_TYPE_PROFILES } from "@/data/maleTypes";
import {
  AI_COMMENT_TEMPLATES_DEFAULT,
  COMPATIBILITY_FORMULA_WEIGHTS_DEFAULT,
  HAPPINESS_WEIGHTS_DEFAULT,
  MARRIAGE_STATS_DEFAULTS,
} from "@/data/cms-defaults";

// Repository Pattern: every getter below tries Firestore's "cms" collection
// first (so an admin can edit content without a redeploy) and transparently
// falls back to the bundled defaults when Firestore isn't configured or the
// document doesn't exist yet. Nothing in the app should import the default
// data files directly except this repository and the admin CMS page (which
// uses them to seed Firestore).

const CMS_COLLECTION = "cms";

// All 7 CMS getters used to each issue their own getDoc(cms/<id>) call. They
// now share a single getDocs(collection("cms")) fetch: the whole collection
// is read once and cached in memory, so any number of getters/renders cost
// exactly one Firestore read instead of one each. Document ids/content are
// unchanged — this only changes how they're fetched.
let cmsCollectionPromise: Promise<Map<string, unknown>> | null = null;

function loadCmsCollection(): Promise<Map<string, unknown>> {
  if (cmsCollectionPromise) return cmsCollectionPromise;

  cmsCollectionPromise = (async () => {
    const map = new Map<string, unknown>();
    const db = getFirestoreDb();
    if (!db) return map;
    try {
      console.time("[measure] firestore: cms collection getDocs");
      const snapshot = await getDocs(collection(db, CMS_COLLECTION));
      console.timeEnd("[measure] firestore: cms collection getDocs");
      snapshot.forEach((docSnap) => {
        map.set(docSnap.id, docSnap.data());
      });
    } catch (error) {
      console.warn("Firestore read failed for cms collection; using bundled defaults.", error);
    }
    return map;
  })();

  return cmsCollectionPromise;
}

async function readDoc<T>(docId: string, fallback: T): Promise<T> {
  const db = getFirestoreDb();
  if (!db) return fallback;
  const map = await loadCmsCollection();
  return map.has(docId) ? (map.get(docId) as T) : fallback;
}

async function writeDoc<T extends object>(docId: string, value: T): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.info(`Firebase is not configured; skipping CMS write for "${docId}".`);
    return;
  }
  await setDoc(doc(db, CMS_COLLECTION, docId), value);
  // Keep the cached collection in sync so any subsequent read (e.g. admin
  // preview) sees the just-written value without an extra Firestore read.
  const map = await loadCmsCollection();
  map.set(docId, value);
}

export async function getTypeProfiles(): Promise<Record<TypeId, TypeProfile>> {
  return TYPE_PROFILES as Record<TypeId, TypeProfile>;
}

export async function setTypeProfiles(value: Record<TypeId, TypeProfile>): Promise<void> {
  await writeDoc("typeProfiles", value);
}

export async function getMaleTypeProfiles(): Promise<Record<MaleTypeId, MaleTypeProfile>> {
  return MALE_TYPE_PROFILES;
}

export async function setMaleTypeProfiles(value: Record<MaleTypeId, MaleTypeProfile>): Promise<void> {
  await writeDoc("maleTypes", value);
}

export async function getMaleCompatibilityTable(): Promise<MaleCompatibilityTable> {
  return MALE_COMPATIBILITY_TABLE;
}

export async function setMaleCompatibilityTable(value: MaleCompatibilityTable): Promise<void> {
  await writeDoc("compatibility", value);
}

export async function getHappinessWeights(): Promise<HappinessWeights> {
  return readDoc("happinessWeights", HAPPINESS_WEIGHTS_DEFAULT);
}

export async function setHappinessWeights(value: HappinessWeights): Promise<void> {
  await writeDoc("happinessWeights", value);
}

export async function getCompatibilityFormulaWeights(): Promise<CompatibilityFormulaWeights> {
  return readDoc("compatibilityFormulaWeights", COMPATIBILITY_FORMULA_WEIGHTS_DEFAULT);
}

export async function setCompatibilityFormulaWeights(value: CompatibilityFormulaWeights): Promise<void> {
  await writeDoc("compatibilityFormulaWeights", value);
}

export async function getAICommentTemplates(): Promise<Record<TypeId, AICommentTemplateSet>> {
  return readDoc("aiTemplates", AI_COMMENT_TEMPLATES_DEFAULT);
}

export async function setAICommentTemplates(value: Record<TypeId, AICommentTemplateSet>): Promise<void> {
  await writeDoc("aiTemplates", value);
}

export async function getMarriageStats(): Promise<Record<TypeId, MarriageStats>> {
  return readDoc("marriageStats", MARRIAGE_STATS_DEFAULTS);
}

export async function setMarriageStats(value: Record<TypeId, MarriageStats>): Promise<void> {
  await writeDoc("marriageStats", value);
}
