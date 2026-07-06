import { AxisScores, HappinessBreakdown, HappinessWeights } from "@/types/quiz";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Peaks at distance=60 (a moderate, non-extreme need for space) and fades out
// toward either end — used as a stand-in for "パートナー受容力", since neither
// constant closeness nor constant distance alone indicates acceptance of a partner.
function partnerAcceptanceRatio(distance: number): number {
  return clamp01(1 - Math.abs(distance - 60) / 40);
}

/** 婚活幸福度: 100pt score from CMS-configurable weights (spec default 30/20/20/20/10). */
export function computeHappiness(
  scores: AxisScores,
  bestMatchScore: number,
  weights: HappinessWeights
): HappinessBreakdown {
  const valueAlignment = Math.round((bestMatchScore / 100) * weights.valueAlignment);
  const marriageReadiness = Math.round(
    (((scores.workFamily + scores.independence) / 2) / 100) * weights.marriageReadiness
  );
  const communication = Math.round((scores.communication / 100) * weights.communicationWeight);
  const mentalIndependence = Math.round((scores.independence / 100) * weights.mentalIndependence);
  const partnerAcceptance = Math.round(
    partnerAcceptanceRatio(scores.distance) * weights.partnerAcceptance
  );

  return {
    valueAlignment,
    marriageReadiness,
    communication,
    mentalIndependence,
    partnerAcceptance,
    total: valueAlignment + marriageReadiness + communication + mentalIndependence + partnerAcceptance,
    weights,
  };
}
