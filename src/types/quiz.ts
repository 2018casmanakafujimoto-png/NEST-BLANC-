// Core domain types for the NEST BLANC value-diagnosis quiz.
// Score weighting per answer is data-driven (see src/data/questions.ts) so it
// can later be swapped for values loaded from an admin panel / CMS without
// touching this file.

export const AXES = [
  "independence", // 自立度
  "communication", // コミュニケーションスタイル
  "lifestyle", // ライフスタイル
  "workFamily", // 仕事×家庭バランス観
  "distance", // 距離感・干渉許容度
] as const;

export type Axis = (typeof AXES)[number];

export type AxisScores = Record<Axis, number>;

export interface QuestionOption {
  key: "A" | "B" | "C" | "D";
  text: string;
  /** Partial: an option only needs to list the axes it actually scores. */
  scores: Partial<AxisScores>;
}

export interface Question {
  id: string;
  order: number;
  text: string;
  options: QuestionOption[];
}

export interface Answer {
  questionId: string;
  optionKey: QuestionOption["key"];
}

export const TYPE_IDS = ["A", "B", "C", "D"] as const;
export type TypeId = (typeof TYPE_IDS)[number];

export interface TypeProfile {
  id: TypeId;
  name: string;
  headline: string;
  description: string;
  mbtiReference: string[];
}

export interface CompatibilityEntry {
  typeId: TypeId;
  score: number;
}

/** Ranked compatible partner types, best match first. */
export type CompatibilityTable = Record<TypeId, CompatibilityEntry[]>;

// --- Phase 2: male types, happiness score, similarity, AI comments, CMS ---
// All additive to the phase-1 types above; nothing existing was removed.

export const MALE_TYPE_IDS = ["M1", "M2", "M3", "M4"] as const;
export type MaleTypeId = (typeof MALE_TYPE_IDS)[number];

export interface MaleTypeProfile {
  id: MaleTypeId;
  name: string;
  traits: string[];
  /** Representative axis profile, used for radar comparison and similarity math. */
  axisVector: AxisScores;
}

export interface MaleCompatibilityEntry {
  maleTypeId: MaleTypeId;
  score: number;
}

/** Ranked compatible male types per female TypeId, best match first. */
export type MaleCompatibilityTable = Record<TypeId, MaleCompatibilityEntry[]>;

/** Point allocation for the 100pt 婚活幸福度 score. Must sum to 100. */
export interface HappinessWeights {
  valueAlignment: number; // 価値観一致力 (30)
  marriageReadiness: number; // 結婚準備度 (20)
  communicationWeight: number; // コミュニケーション (20)
  mentalIndependence: number; // 精神的自立 (20)
  partnerAcceptance: number; // パートナー受容力 (10)
}

export interface HappinessBreakdown {
  valueAlignment: number;
  marriageReadiness: number;
  communication: number;
  mentalIndependence: number;
  partnerAcceptance: number;
  total: number;
  weights: HappinessWeights;
}

export interface SimilarityResult {
  percent: number; // 0-100, cosine similarity vs. married-member average
}

/** Weights for the per-match compatibility formula (must sum to 100). */
export interface CompatibilityFormulaWeights {
  valueMatch: number; // 価値観一致率 (40)
  complementarity: number; // 補完性 (30)
  dataMatch: number; // 婚活データ一致率 (20)
  lifestyleMatch: number; // ライフスタイル一致率 (10)
}

/** CMS-editable phrase banks used to assemble the AI comment, per TypeId. */
export interface AICommentTemplateSet {
  typeIntro: string;
  strengths: string;
  idealPartner: string;
  cautions: string;
  advice: string;
}

export interface MarriageStats {
  typeShare: number; // 構成比 (%)
  marriedShare: number; // 成婚者に占める割合 (%)
  note: string;
}

export interface DiagnosisResult {
  typeId: TypeId;
  scores: AxisScores;
  profile: TypeProfile;
  maleRanking: MaleCompatibilityEntry[];
  topMatch: {
    profile: MaleTypeProfile;
    rankScore: number;
    formulaScore: number;
  };
  happiness: HappinessBreakdown;
  similarity: SimilarityResult;
  aiComment: string;
  marriageStats: MarriageStats;
}

// --- Phase 3: CMS content types not tied to the scoring engine (additive) ---

export interface CTAContent {
  heading: string;
  body: string;
  buttonLabel: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
}
