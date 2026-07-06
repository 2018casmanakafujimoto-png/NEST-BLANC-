import { questions } from "@/data/questions";
import { computeRawScores, normalizeScores, determineType } from "@/lib/scoring";
import { computeHappiness } from "@/lib/happiness";
import { computeCompatibilityScore } from "@/lib/compatibilityScore";
import { computeSimilarityPercent } from "@/lib/similarity";
import { generateAIComment } from "@/lib/aiComment";
import {
  getAICommentTemplates,
  getCompatibilityFormulaWeights,
  getHappinessWeights,
  getMaleCompatibilityTable,
  getMaleTypeProfiles,
  getMarriageStats,
  getTypeProfiles,
} from "@/repositories/cmsRepository";
import { getMarriedAverageVector } from "@/repositories/statsRepository";
import { Answer, DiagnosisResult } from "@/types/quiz";

// Service Layer: the single orchestration point the result page (and any
// future admin preview) calls. It composes the pure scoring/calculator
// functions in src/lib with the CMS content from src/repositories, so no UI
// component needs to know where content comes from or how scores are derived.
export async function buildDiagnosisResult(answers: Answer[]): Promise<DiagnosisResult> {
  const rawScores = computeRawScores(questions, answers);
  const scores = normalizeScores(questions, rawScores);
  const typeId = determineType(scores);

  const [typeProfiles, maleTypeProfiles, maleCompatibilityTable, happinessWeights, compatibilityWeights, aiTemplates, marriageStatsTable, marriedAverage] =
    await Promise.all([
      getTypeProfiles(),
      getMaleTypeProfiles(),
      getMaleCompatibilityTable(),
      getHappinessWeights(),
      getCompatibilityFormulaWeights(),
      getAICommentTemplates(),
      getMarriageStats(),
      getMarriedAverageVector(typeId),
    ]);

  const profile = typeProfiles[typeId];
  const maleRanking = maleCompatibilityTable[typeId];
  const topRanked = maleRanking[0];
  const topMaleProfile = maleTypeProfiles[topRanked.maleTypeId];

  const formulaScore = computeCompatibilityScore(
    { userScores: scores, partnerScores: topMaleProfile.axisVector, rankingScore: topRanked.score },
    compatibilityWeights
  );

  const happiness = computeHappiness(scores, topRanked.score, happinessWeights);
  const similarityPercent = computeSimilarityPercent(scores, marriedAverage);
  const aiComment = generateAIComment(aiTemplates[typeId]);

  return {
    typeId,
    scores,
    profile,
    maleRanking,
    topMatch: { profile: topMaleProfile, rankScore: topRanked.score, formulaScore },
    happiness,
    similarity: { percent: similarityPercent },
    aiComment,
    marriageStats: marriageStatsTable[typeId],
  };
}
