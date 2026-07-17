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
  console.time("[measure] buildDiagnosisResult: total");

  console.time("[measure] buildDiagnosisResult: scoring compute");
  const rawScores = computeRawScores(questions, answers);
  const scores = normalizeScores(questions, rawScores);
  const typeId = determineType(scores);
  console.timeEnd("[measure] buildDiagnosisResult: scoring compute");

  console.time("[measure] buildDiagnosisResult: repositories Promise.all");
  console.time("[measure] repo: getTypeProfiles");
  console.time("[measure] repo: getMaleTypeProfiles");
  console.time("[measure] repo: getMaleCompatibilityTable");
  console.time("[measure] repo: getHappinessWeights");
  console.time("[measure] repo: getCompatibilityFormulaWeights");
  console.time("[measure] repo: getAICommentTemplates");
  console.time("[measure] repo: getMarriageStats");
  console.time("[measure] repo: getMarriedAverageVector");
  const [typeProfiles, maleTypeProfiles, maleCompatibilityTable, happinessWeights, compatibilityWeights, aiTemplates, marriageStatsTable, marriedAverage] =
    await Promise.all([
      getTypeProfiles().then((v) => (console.timeEnd("[measure] repo: getTypeProfiles"), v)),
      getMaleTypeProfiles().then((v) => (console.timeEnd("[measure] repo: getMaleTypeProfiles"), v)),
      getMaleCompatibilityTable().then((v) => (console.timeEnd("[measure] repo: getMaleCompatibilityTable"), v)),
      getHappinessWeights().then((v) => (console.timeEnd("[measure] repo: getHappinessWeights"), v)),
      getCompatibilityFormulaWeights().then((v) => (console.timeEnd("[measure] repo: getCompatibilityFormulaWeights"), v)),
      getAICommentTemplates().then((v) => (console.timeEnd("[measure] repo: getAICommentTemplates"), v)),
      getMarriageStats().then((v) => (console.timeEnd("[measure] repo: getMarriageStats"), v)),
      getMarriedAverageVector(typeId).then((v) => (console.timeEnd("[measure] repo: getMarriedAverageVector"), v)),
    ]);
  console.timeEnd("[measure] buildDiagnosisResult: repositories Promise.all");

  console.time("[measure] buildDiagnosisResult: post-processing compute");
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
  console.timeEnd("[measure] buildDiagnosisResult: post-processing compute");

  console.timeEnd("[measure] buildDiagnosisResult: total");
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
