import { doc, getDoc, setDoc } from "firebase/firestore";
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

async function readDoc<T>(docId: string, fallback: T): Promise<T> {
  const db = getFirestoreDb();
  if (!db) return fallback;
  try {
    const snapshot = await getDoc(doc(db, CMS_COLLECTION, docId));
    return snapshot.exists() ? (snapshot.data() as T) : fallback;
  } catch (error) {
    console.warn(`Firestore read failed for cms/${docId}; using bundled default.`, error);
    return fallback;
  }
}

async function writeDoc<T extends object>(docId: string, value: T): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.info(`Firebase is not configured; skipping CMS write for "${docId}".`);
    return;
  }
  await setDoc(doc(db, CMS_COLLECTION, docId), value);
}

export async function getTypeProfiles(): Promise<Record<TypeId, TypeProfile>> {
  return readDoc("typeProfiles", TYPE_PROFILES as Record<TypeId, TypeProfile>);
}

export async function setTypeProfiles(value: Record<TypeId, TypeProfile>): Promise<void> {
  await writeDoc("typeProfiles", value);
}

export async function getMaleTypeProfiles(): Promise<Record<MaleTypeId, MaleTypeProfile>> {
  return readDoc("maleTypes", MALE_TYPE_PROFILES);
}

export async function setMaleTypeProfiles(value: Record<MaleTypeId, MaleTypeProfile>): Promise<void> {
  await writeDoc("maleTypes", value);
}

export async function getMaleCompatibilityTable(): Promise<MaleCompatibilityTable> {
  return readDoc("compatibility", MALE_COMPATIBILITY_TABLE);
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
