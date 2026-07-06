import { AXES, Axis, AxisScores, CompatibilityFormulaWeights } from "@/types/quiz";

function axisSimilarity(a: AxisScores, b: AxisScores, axes: Axis[]): number {
  const meanAbsDiff = axes.reduce((sum, axis) => sum + Math.abs(a[axis] - b[axis]), 0) / axes.length;
  return Math.max(0, 100 - meanAbsDiff);
}

// "Complementary" pairings aren't simply "similar" or "opposite" — a large but
// not extreme gap on independence/communication is treated as the best fit,
// peaking at a 25pt difference and fading on either side.
function complementarity(a: AxisScores, b: AxisScores): number {
  const gap =
    (Math.abs(a.independence - b.independence) + Math.abs(a.communication - b.communication)) / 2;
  const fit = 1 - Math.abs(gap - 25) / 50;
  return Math.max(0, Math.min(100, fit * 100));
}

export interface CompatibilityInputs {
  userScores: AxisScores;
  partnerScores: AxisScores;
  /** The CMS-configured ranking score for this female/male type pair (real matching-data signal). */
  rankingScore: number;
}

/** 相性計算式: 価値観一致率40% + 補完性30% + 婚活データ一致率20% + ライフスタイル一致率10%. */
export function computeCompatibilityScore(
  inputs: CompatibilityInputs,
  weights: CompatibilityFormulaWeights
): number {
  const valueMatch = axisSimilarity(inputs.userScores, inputs.partnerScores, [...AXES]);
  const complementarityScore = complementarity(inputs.userScores, inputs.partnerScores);
  const dataMatch = inputs.rankingScore;
  const lifestyleMatch = axisSimilarity(inputs.userScores, inputs.partnerScores, ["lifestyle"]);

  const total =
    (valueMatch * weights.valueMatch +
      complementarityScore * weights.complementarity +
      dataMatch * weights.dataMatch +
      lifestyleMatch * weights.lifestyleMatch) /
    100;

  return Math.round(Math.max(0, Math.min(100, total)));
}
