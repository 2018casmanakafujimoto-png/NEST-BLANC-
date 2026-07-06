import { AXES, AxisScores, Answer, Question, TypeId, TYPE_IDS } from "@/types/quiz";

function zeroScores(): AxisScores {
  return AXES.reduce((acc, axis) => {
    acc[axis] = 0;
    return acc;
  }, {} as AxisScores);
}

/** Sums the raw per-axis points awarded by each selected answer. */
export function computeRawScores(questions: Question[], answers: Answer[]): AxisScores {
  const raw = zeroScores();
  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    const option = question?.options.find((o) => o.key === answer.optionKey);
    if (!option) continue;
    for (const axis of AXES) {
      raw[axis] += option.scores[axis] ?? 0;
    }
  }
  return raw;
}

/** Highest score any single option offers per axis, used as the normalization ceiling. */
function computeMaxPossible(questions: Question[]): AxisScores {
  const max = zeroScores();
  for (const question of questions) {
    for (const axis of AXES) {
      const best = Math.max(0, ...question.options.map((o) => o.scores[axis] ?? 0));
      max[axis] += best;
    }
  }
  return max;
}

/** Converts raw axis totals into a 0-100 scale relative to the question set's max. */
export function normalizeScores(questions: Question[], raw: AxisScores): AxisScores {
  const max = computeMaxPossible(questions);
  const normalized = zeroScores();
  for (const axis of AXES) {
    normalized[axis] = max[axis] > 0 ? Math.round((raw[axis] / max[axis]) * 100) : 0;
  }
  return normalized;
}

// Anchor points mirror the threshold conditions in the spec. They're only used
// as a tie-breaker when a respondent's scores don't cleanly satisfy any single
// type's rule (the four rules are not mutually exclusive or exhaustive).
const TYPE_ANCHORS: Record<TypeId, AxisScores> = {
  A: { independence: 90, communication: 50, lifestyle: 50, workFamily: 85, distance: 55 },
  B: { independence: 55, communication: 90, lifestyle: 50, workFamily: 50, distance: 90 },
  C: { independence: 80, communication: 50, lifestyle: 90, workFamily: 70, distance: 50 },
  D: { independence: 50, communication: 80, lifestyle: 85, workFamily: 50, distance: 85 },
};

function matchesRule(id: TypeId, s: AxisScores): boolean {
  switch (id) {
    case "A":
      return s.independence >= 80 && s.workFamily >= 75 && s.distance <= 70;
    case "B":
      return s.communication >= 80 && s.distance >= 75 && s.independence <= 70;
    case "C":
      return s.independence >= 70 && s.lifestyle >= 80 && s.workFamily >= 65;
    case "D":
      return s.lifestyle >= 80 && s.distance >= 75 && s.communication >= 70;
  }
}

function distanceTo(anchor: AxisScores, s: AxisScores): number {
  return Math.sqrt(AXES.reduce((sum, axis) => sum + (anchor[axis] - s[axis]) ** 2, 0));
}

// Each type's rule mixes ">=" and "<=" conditions; inverting the "<=" axis
// (100 - value) lets us sum all of a type's defining axes into one comparable
// "fit" composite, used as tie-break step ① (総合スコア) below.
function compositeScore(id: TypeId, s: AxisScores): number {
  switch (id) {
    case "A":
      return s.independence + s.workFamily + (100 - s.distance);
    case "B":
      return s.communication + s.distance + (100 - s.independence);
    case "C":
      return s.independence + s.lifestyle + s.workFamily;
    case "D":
      return s.lifestyle + s.distance + s.communication;
  }
}

// Spec tie-break step ① (総合スコア) is each candidate's composite fit score.
// Steps ②-⑥ (仕事家庭 → コミュニケーション → ライフスタイル → 自立度 → 距離感)
// name individual axes, but those axis values are properties of the respondent,
// not the candidate type, so they can't distinguish between two matching types.
// composite score already incorporates every one of those axes per type, so a
// composite tie falls back to declaration order for a stable, deterministic result.
function compareCandidates(a: TypeId, b: TypeId, s: AxisScores): number {
  const compositeDiff = compositeScore(b, s) - compositeScore(a, s);
  if (compositeDiff !== 0) return compositeDiff;
  return TYPE_IDS.indexOf(a) - TYPE_IDS.indexOf(b);
}

/** Rule-matches first; among multiple matches, applies the spec's tie-break priority. */
export function determineType(scores: AxisScores): TypeId {
  const ruleMatches = (["A", "B", "C", "D"] as TypeId[]).filter((id) => matchesRule(id, scores));
  if (ruleMatches.length > 0) {
    return [...ruleMatches].sort((a, b) => compareCandidates(a, b, scores))[0];
  }

  let closest: TypeId = "A";
  let closestDistance = Infinity;
  for (const id of ["A", "B", "C", "D"] as TypeId[]) {
    const d = distanceTo(TYPE_ANCHORS[id], scores);
    if (d < closestDistance) {
      closest = id;
      closestDistance = d;
    }
  }
  return closest;
}
