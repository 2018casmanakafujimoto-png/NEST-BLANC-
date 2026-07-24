import { MaleTypeProfile, MaleTypeId } from "@/types/quiz";

// Default/fallback male type definitions. This is CMS-editable content: the
// repository layer (src/repositories/cmsRepository.ts) tries Firestore first
// and only falls back to this file when Firestore isn't configured, so admins
// can override these values without a deploy.
export const MALE_TYPE_PROFILES: Record<MaleTypeId, MaleTypeProfile> = {
  M1: {
    id: "M1",
    name: "穏やか誠実型",
    traits: ["約束を守る", "家族思い", "感情が安定", "共働き理解"],
    axisVector: { independence: 52, communication: 88, lifestyle: 58, workFamily: 62, distance: 84 },
    mbtiReference: ["ISFJ", "ISTJ", "INFJ"],
  },
  M2: {
    id: "M2",
    name: "自立キャリア型",
    traits: ["高い向上心", "キャリア志向", "決断力", "女性を尊重"],
    axisVector: { independence: 90, communication: 62, lifestyle: 55, workFamily: 84, distance: 58 },
    mbtiReference: ["ENTJ", "ESTJ", "INTJ"],
  },
  M3: {
    id: "M3",
    name: "成長パートナー型",
    traits: ["ポジティブ", "行動力", "学び好き", "一緒に成長できる"],
    axisVector: { independence: 76, communication: 70, lifestyle: 82, workFamily: 68, distance: 60 },
    mbtiReference: ["ENFP", "ENTP", "ESFP"],
  },
  M4: {
    id: "M4",
    name: "自由感性型",
    traits: ["趣味を大切にする", "発想力", "柔軟", "感性豊か"],
    axisVector: { independence: 58, communication: 72, lifestyle: 88, workFamily: 50, distance: 80 },
    mbtiReference: ["ISFP", "INFP", "ISTP"],
  },
};
