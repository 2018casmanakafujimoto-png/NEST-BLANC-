import { AXES, AxisScores } from "@/types/quiz";

export function axisScoresToVector(scores: AxisScores): number[] {
  return AXES.map((axis) => scores[axis]);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

/** 成婚女性類似度: cosine similarity vs. the married-member average vector, 0-100. */
export function computeSimilarityPercent(userScores: AxisScores, marriedAverage: AxisScores): number {
  const similarity = cosineSimilarity(axisScoresToVector(userScores), axisScoresToVector(marriedAverage));
  return Math.round(Math.max(0, Math.min(1, similarity)) * 100);
}
