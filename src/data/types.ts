import { MaleCompatibilityTable, TypeProfile } from "@/types/quiz";

export const TYPE_PROFILES: Record<string, TypeProfile> = {
  A: {
    id: "A",
    name: "自律キャリアタイプ",
    headline: "自分の軸を持ちながら、対等に支え合える関係を築く人",
    description:
      "経済的にも精神的にも自立していて、パートナーには「支配」ではなく「尊重」を求めるタイプ。仕事と家庭のどちらも大切にしながら、対等なパートナーシップを築くことに幸せを感じます。",
    mbtiReference: ["ENTJ", "ESTJ", "INTJ"],
  },
  B: {
    id: "B",
    name: "安心共感タイプ",
    headline: "安心感と信頼を何より大切にする人",
    description:
      "恋愛のドキドキよりも、「この人となら結婚生活が想像できる」という安心感を重視するタイプ。相手の気持ちに寄り添い、長く信頼関係を育てることを大切にします。",
    mbtiReference: ["INFJ", "ISFJ", "ESFJ"],
  },
  C: {
    id: "C",
    name: "成長パートナータイプ",
    headline: "お互いに高め合いながら人生を楽しむ人",
    description:
      "新しい経験や挑戦を大切にし、パートナーとも刺激を与え合いながら成長したいタイプ。変化を恐れず、二人で一緒に人生を切り拓いていくことに幸せを感じます。",
    mbtiReference: ["ENFP", "ENTP", "ENFJ"],
  },
  D: {
    id: "D",
    name: "ライフスタイル重視タイプ",
    headline: "心地よい距離感とマイペースな日常を大切にする人",
    description:
      "お互いの時間や空間を尊重し合い、無理のない心地よい関係を望むタイプ。穏やかな日常の積み重ねの中に、確かな幸せを見出します。",
    mbtiReference: ["INFP", "ISFP", "ISTP"],
  },
};

// Ranked compatible male types per female TypeId, best match first, mirroring the spec's table.
export const MALE_COMPATIBILITY_TABLE: MaleCompatibilityTable = {
  A: [
    { maleTypeId: "M2", score: 98 },
    { maleTypeId: "M3", score: 95 },
    { maleTypeId: "M1", score: 89 },
    { maleTypeId: "M4", score: 82 },
  ],
  B: [
    { maleTypeId: "M1", score: 98 },
    { maleTypeId: "M3", score: 93 },
    { maleTypeId: "M2", score: 88 },
    { maleTypeId: "M4", score: 81 },
  ],
  C: [
    { maleTypeId: "M2", score: 97 },
    { maleTypeId: "M4", score: 94 },
    { maleTypeId: "M3", score: 90 },
    { maleTypeId: "M1", score: 85 },
  ],
  D: [
    { maleTypeId: "M4", score: 98 },
    { maleTypeId: "M1", score: 92 },
    { maleTypeId: "M3", score: 88 },
    { maleTypeId: "M2", score: 84 },
  ],
};
