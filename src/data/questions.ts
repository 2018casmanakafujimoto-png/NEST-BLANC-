import { Question } from "@/types/quiz";

// Full 20-question set per spec. `workFamily` here corresponds to the spec's
// `work_family` key (renamed only to match the existing Axis type in
// src/types/quiz.ts; no other logic changes).
export const questions: Question[] = [
  {
    id: "q1",
    order: 1,
    text: "理想の休日は？",
    options: [
      { key: "A", text: "家で映画や読書", scores: { lifestyle: 4, distance: 2 } },
      { key: "B", text: "カフェやショッピング", scores: { communication: 3, lifestyle: 3 } },
      { key: "C", text: "旅行やイベント", scores: { lifestyle: 5, communication: 2 } },
      { key: "D", text: "資格取得や勉強", scores: { independence: 5, workFamily: 3 } },
    ],
  },
  {
    id: "q2",
    order: 2,
    text: "理想の連絡頻度は？",
    options: [
      { key: "A", text: "できれば毎日何度も", scores: { distance: 5, communication: 2 } },
      { key: "B", text: "毎日1〜2回", scores: { distance: 4, communication: 2 } },
      { key: "C", text: "必要な時だけ", scores: { distance: 2, independence: 2 } },
      { key: "D", text: "お互い自由が理想", scores: { independence: 5, distance: 1 } },
    ],
  },
  {
    id: "q3",
    order: 3,
    text: "結婚後の働き方は？",
    options: [
      { key: "A", text: "共働きを続けたい", scores: { workFamily: 5, independence: 3 } },
      { key: "B", text: "状況に応じて決めたい", scores: { workFamily: 3, communication: 2 } },
      { key: "C", text: "家庭を優先したい", scores: { workFamily: 2, distance: 1 } },
      { key: "D", text: "独立や挑戦もしたい", scores: { independence: 5, workFamily: 4 } },
    ],
  },
  {
    id: "q4",
    order: 4,
    text: "男性に一番求めるものは？",
    options: [
      { key: "A", text: "誠実さ", scores: { communication: 5 } },
      { key: "B", text: "安心感", scores: { distance: 4, communication: 2 } },
      { key: "C", text: "向上心", scores: { independence: 4, workFamily: 2 } },
      { key: "D", text: "一緒に笑えること", scores: { lifestyle: 5, communication: 2 } },
    ],
  },
  {
    id: "q5",
    order: 5,
    text: "意見が違った時は？",
    options: [
      { key: "A", text: "話し合いたい", scores: { communication: 5 } },
      { key: "B", text: "少し時間を置きたい", scores: { distance: 3, communication: 2 } },
      { key: "C", text: "自分が合わせる", scores: { distance: 4, workFamily: 2 } },
      { key: "D", text: "自分の考えを伝える", scores: { independence: 4, communication: 3 } },
    ],
  },
  {
    id: "q6",
    order: 6,
    text: "お金の使い方は？",
    options: [
      { key: "A", text: "貯金重視", scores: { workFamily: 5, independence: 2 } },
      { key: "B", text: "バランス重視", scores: { workFamily: 4, lifestyle: 2 } },
      { key: "C", text: "経験へ使う", scores: { lifestyle: 5, communication: 2 } },
      { key: "D", text: "自己投資", scores: { independence: 5, lifestyle: 3 } },
    ],
  },
  {
    id: "q7",
    order: 7,
    text: "理想のデートは？",
    options: [
      { key: "A", text: "家でゆっくり", scores: { distance: 4 } },
      { key: "B", text: "美味しいご飯", scores: { communication: 3, lifestyle: 2 } },
      { key: "C", text: "旅行", scores: { lifestyle: 5 } },
      { key: "D", text: "新しい体験", scores: { independence: 2, lifestyle: 5 } },
    ],
  },
  {
    id: "q8",
    order: 8,
    text: "仕事で大切なのは？",
    options: [
      { key: "A", text: "安定", scores: { workFamily: 5 } },
      { key: "B", text: "やりがい", scores: { communication: 2, workFamily: 3 } },
      { key: "C", text: "家庭との両立", scores: { workFamily: 4, distance: 2 } },
      { key: "D", text: "成長", scores: { independence: 5, workFamily: 3 } },
    ],
  },
  {
    id: "q9",
    order: 9,
    text: "子育ては？",
    options: [
      { key: "A", text: "協力して行いたい", scores: { workFamily: 5, communication: 3 } },
      { key: "B", text: "話し合って決めたい", scores: { communication: 4, workFamily: 3 } },
      { key: "C", text: "家庭を優先したい", scores: { workFamily: 4, distance: 2 } },
      { key: "D", text: "まだ考えていない", scores: { independence: 2 } },
    ],
  },
  {
    id: "q10",
    order: 10,
    text: "相手が忙しい時は？",
    options: [
      { key: "A", text: "応援する", scores: { communication: 4, independence: 2 } },
      { key: "B", text: "少し寂しい", scores: { distance: 3 } },
      { key: "C", text: "自分も楽しむ", scores: { independence: 5, distance: 2 } },
      { key: "D", text: "なるべく会いたい", scores: { distance: 5, communication: 2 } },
    ],
  },
  {
    id: "q11",
    order: 11,
    text: "将来住む場所を選ぶなら？",
    options: [
      { key: "A", text: "自然が多く落ち着いた場所", scores: { lifestyle: 4, distance: 2 } },
      { key: "B", text: "利便性の高い都市部", scores: { independence: 3, lifestyle: 3 } },
      { key: "C", text: "家族の近く", scores: { workFamily: 5, communication: 2 } },
      { key: "D", text: "仕事に合わせて柔軟に決めたい", scores: { independence: 5, workFamily: 2 } },
    ],
  },
  {
    id: "q12",
    order: 12,
    text: "結婚後のお金の管理は？",
    options: [
      { key: "A", text: "共同口座で一緒に管理したい", scores: { workFamily: 5, communication: 3 } },
      { key: "B", text: "生活費だけ共有したい", scores: { workFamily: 4, independence: 2 } },
      { key: "C", text: "基本は別々に管理したい", scores: { independence: 5, distance: 2 } },
      { key: "D", text: "状況に応じて決めたい", scores: { communication: 4, workFamily: 2 } },
    ],
  },
  {
    id: "q13",
    order: 13,
    text: "パートナーが転勤になったら？",
    options: [
      { key: "A", text: "一緒について行く", scores: { workFamily: 5, distance: 2 } },
      { key: "B", text: "話し合って決める", scores: { communication: 5, workFamily: 2 } },
      { key: "C", text: "自分の仕事を優先したい", scores: { independence: 5, workFamily: 1 } },
      { key: "D", text: "状況によって柔軟に考える", scores: { communication: 3, independence: 2 } },
    ],
  },
  {
    id: "q14",
    order: 14,
    text: "家事の分担について理想なのは？",
    options: [
      { key: "A", text: "完全に半分ずつ", scores: { workFamily: 5 } },
      { key: "B", text: "得意な方が担当", scores: { communication: 3, workFamily: 4 } },
      { key: "C", text: "その時の状況で協力", scores: { communication: 4, workFamily: 3 } },
      { key: "D", text: "話し合って柔軟に決める", scores: { communication: 5, workFamily: 5 } },
    ],
  },
  {
    id: "q15",
    order: 15,
    text: "喧嘩をした時は？",
    options: [
      { key: "A", text: "その日のうちに仲直りしたい", scores: { communication: 5, distance: 2 } },
      { key: "B", text: "少し時間を置いて話したい", scores: { distance: 4, communication: 2 } },
      { key: "C", text: "相手から来てほしい", scores: { distance: 5 } },
      { key: "D", text: "お互い冷静になってから話したい", scores: { communication: 4, independence: 2 } },
    ],
  },
  {
    id: "q16",
    order: 16,
    text: "パートナーにはどんな存在でいてほしいですか？",
    options: [
      { key: "A", text: "親友のような存在", scores: { communication: 5 } },
      { key: "B", text: "人生のパートナー", scores: { workFamily: 4, communication: 3 } },
      { key: "C", text: "尊敬できる存在", scores: { independence: 4, workFamily: 2 } },
      { key: "D", text: "お互い自由を尊重できる存在", scores: { distance: 5, independence: 3 } },
    ],
  },
  {
    id: "q17",
    order: 17,
    text: "パートナーが落ち込んでいたら？",
    options: [
      { key: "A", text: "話を最後まで聞く", scores: { communication: 5 } },
      { key: "B", text: "励ます", scores: { communication: 4, distance: 2 } },
      { key: "C", text: "そっと見守る", scores: { distance: 5 } },
      { key: "D", text: "気分転換に誘う", scores: { lifestyle: 4, communication: 2 } },
    ],
  },
  {
    id: "q18",
    order: 18,
    text: "義理の家族との付き合いは？",
    options: [
      { key: "A", text: "積極的に交流したい", scores: { workFamily: 5, communication: 2 } },
      { key: "B", text: "程よい距離感が理想", scores: { distance: 4, communication: 2 } },
      { key: "C", text: "必要最低限がいい", scores: { independence: 5, distance: 2 } },
      { key: "D", text: "相手に合わせたい", scores: { communication: 4, workFamily: 2 } },
    ],
  },
  {
    id: "q19",
    order: 19,
    text: "結婚生活で最も大切だと思うことは？",
    options: [
      { key: "A", text: "信頼", scores: { distance: 4, communication: 2 } },
      { key: "B", text: "会話", scores: { communication: 5, distance: 2 } },
      { key: "C", text: "価値観の一致", scores: { lifestyle: 4, workFamily: 2 } },
      { key: "D", text: "お互いを尊重すること", scores: { independence: 3, communication: 3 } },
    ],
  },
  {
    id: "q20",
    order: 20,
    text: "二人で大きな決断をする時、あなたはどうしたいですか？",
    options: [
      { key: "A", text: "しっかり話し合って決めたい", scores: { communication: 5, workFamily: 2 } },
      { key: "B", text: "お互いが納得できる方法を探したい", scores: { communication: 4, distance: 3 } },
      { key: "C", text: "状況に応じて柔軟に決めたい", scores: { independence: 3, lifestyle: 3 } },
      { key: "D", text: "得意な方がリードすればいい", scores: { independence: 4, workFamily: 2 } },
    ],
  },
];
