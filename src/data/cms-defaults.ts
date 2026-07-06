import {
  AICommentTemplateSet,
  Article,
  AxisScores,
  CompatibilityFormulaWeights,
  CTAContent,
  HappinessWeights,
  MarriageStats,
  TypeId,
} from "@/types/quiz";

// Default/fallback values for everything the spec marks as CMS-editable.
// src/repositories/cmsRepository.ts reads Firestore first and only falls back
// to these when Firestore isn't configured, so none of this is hardcoded in
// the sense of "can only be changed by redeploying" — it's the seed data an
// admin edits from /admin.

export const HAPPINESS_WEIGHTS_DEFAULT: HappinessWeights = {
  valueAlignment: 30,
  marriageReadiness: 20,
  communicationWeight: 20,
  mentalIndependence: 20,
  partnerAcceptance: 10,
};

export const COMPATIBILITY_FORMULA_WEIGHTS_DEFAULT: CompatibilityFormulaWeights = {
  valueMatch: 40,
  complementarity: 30,
  dataMatch: 20,
  lifestyleMatch: 10,
};

export const MARRIAGE_STATS_DEFAULTS: Record<TypeId, MarriageStats> = {
  A: {
    typeShare: 22,
    marriedShare: 26,
    note: "「対等な関係を築けるか」を重視する方ほど、成婚までの期間が短い傾向があります。",
  },
  B: {
    typeShare: 28,
    marriedShare: 34,
    note: "誠実さや価値観の一致を重視した方ほど、短期間で成婚する傾向があります。",
  },
  C: {
    typeShare: 24,
    marriedShare: 21,
    note: "共に成長できる関係を重視する方は、価値観が一致した相手との成婚率が高い傾向があります。",
  },
  D: {
    typeShare: 26,
    marriedShare: 19,
    note: "心地よい距離感を大切にする方は、無理のない関係を築ける相手との成婚率が高い傾向があります。",
  },
};

// Average diagnosis-axis vector among members who went on to marry, per type.
// Backs the "成婚女性類似度" cosine-similarity display; overridable from the
// Firestore "stats" collection (see src/repositories/statsRepository.ts).
export const MARRIED_AVERAGE_VECTORS_DEFAULT: Record<TypeId, AxisScores> = {
  A: { independence: 86, communication: 62, lifestyle: 58, workFamily: 82, distance: 52 },
  B: { independence: 55, communication: 88, lifestyle: 60, workFamily: 64, distance: 82 },
  C: { independence: 76, communication: 64, lifestyle: 86, workFamily: 70, distance: 54 },
  D: { independence: 52, communication: 78, lifestyle: 86, workFamily: 56, distance: 82 },
};

export const AI_COMMENT_TEMPLATES_DEFAULT: Record<TypeId, AICommentTemplateSet> = {
  A: {
    typeIntro:
      "「自律キャリアタイプ」は、経済的にも精神的にも自立していて、パートナーには支配ではなく尊重を求める価値観の持ち主です。仕事にも家庭にも真剣に向き合いながら、対等な関係を築くことを大切にしています。",
    strengths:
      "あなたの強みは、自分の意見をしっかり持ちながらも、相手の立場を尊重できるバランス感覚です。仕事において培った責任感や決断力は、結婚生活の中でも大きな支えになります。努力を重ねてきたからこそ、同じように努力する人の価値を理解できるのも魅力です。",
    idealPartner:
      "あなたが幸せになれるのは、あなたの仕事や挑戦を応援しながら、家庭でも対等なパートナーシップを築ける男性です。年収や肩書きよりも、お互いの時間を尊重し合えるか、家事や将来設計について率直に話し合えるかが鍵になります。金銭感覚についても、貯めることだけでなく、必要な時に投資できる柔軟さを共有できる相手だと、結婚生活はより安定したものになるでしょう。共働きを続けながらも、お互いを高め合える関係が、あなたにとって最も心地よい距離感です。",
    cautions:
      "自立心が強い分、相手に頼ることを遠慮してしまう場面があるかもしれません。婚活では、弱さや不安も含めて話せる相手かどうかを、早い段階で確認しておくと安心です。仕事の話や将来のお金の使い方について、遠慮せずオープンに話し合える関係を意識してみてください。",
    advice:
      "婚活では、条件だけでなく「対等に話し合えるか」を大切な判断基準にしてみましょう。仕事観や結婚生活後の役割分担について、早めに具体的な会話を重ねることで、価値観のずれを防ぎやすくなります。あなたらしいペースで、信頼できるパートナーと出会えることを願っています。",
  },
  B: {
    typeIntro:
      "「安心共感タイプ」は、恋愛のときめきよりも「この人となら結婚生活を築ける」という安心感を大切にする価値観の持ち主です。相手の気持ちに寄り添い、長く信頼関係を育てていくことに幸せを感じます。",
    strengths:
      "あなたの強みは、相手の話にじっくり耳を傾けられる共感力と、相手を思いやる優しさです。感情が安定していて、家庭の中に穏やかな空気をつくることができます。誠実さを大切にするあなたの姿勢は、結婚生活の土台をしっかり支えてくれます。",
    idealPartner:
      "あなたが幸せになれるのは、約束を守り、感情が安定していて、家族を大切にする男性です。刺激的な恋愛よりも、日々の安心感を積み重ねられる相手との方が、結婚後の満足度は高くなる傾向があります。仕事についても、あなたの気持ちに寄り添いながら、家庭とのバランスを一緒に考えてくれる相手だと安心できるでしょう。距離感については、程よく連絡を取り合いながらも、お互いの時間を尊重できる関係が理想的です。金銭感覚も無理のない範囲で堅実に管理できる相手だと、将来の不安が少なくなります。",
    cautions:
      "優しさゆえに、自分の気持ちを我慢して相手に合わせすぎてしまう傾向があります。婚活の初期段階から、仕事や家事、お金について本音で話せる相手かどうかを確認しておくことをおすすめします。我慢を重ねるより、素直な気持ちを伝える練習をしてみましょう。",
    advice:
      "婚活では、安心感を与えてくれる相手を見極めると同時に、あなた自身の希望もしっかり伝えることを意識してみてください。誠実さと安定感を軸に相手を見ることで、長く続く信頼関係を築きやすくなります。焦らず、あなたのペースで進めていきましょう。",
  },
  C: {
    typeIntro:
      "「成長パートナータイプ」は、新しい経験や挑戦を大切にし、パートナーと刺激を与え合いながら成長したいと考える価値観の持ち主です。変化を恐れず、二人で人生を切り拓いていくことに幸せを感じます。",
    strengths:
      "あなたの強みは、前向きな行動力と、新しいことに挑戦し続ける向上心です。仕事でも私生活でも学び続ける姿勢を持っていて、その姿勢は自然と周囲の人にも良い影響を与えます。変化を楽しめる柔軟さは、結婚生活を飽きのないものにしてくれます。",
    idealPartner:
      "あなたが幸せになれるのは、あなたの成長を応援し、一緒に新しいことへ挑戦できる男性です。仕事に対しても前向きで、家庭との両立を柔軟に考えられる相手だと、お互いを高め合う関係を築きやすくなります。価値観については、正解を決めつけず、話し合いながら二人らしいスタイルを作っていける相手が理想です。金銭感覚も、貯蓄だけでなく経験や自己投資に前向きな相手だと、価値観が一致しやすいでしょう。距離感は、お互いの挑戦を尊重し合いながら、必要なときにしっかり支え合える関係が心地よいはずです。",
    cautions:
      "刺激や変化を求めるあまり、安定感を大切にする相手との温度差を感じることがあるかもしれません。婚活では、将来の生活設計についても具体的に話し合い、お互いのペースの違いを早めにすり合わせておくと安心です。",
    advice:
      "婚活では、一緒に成長できるかどうかを大切な視点にしてみてください。仕事観や将来のライフスタイルについて率直に語り合うことで、価値観の近い相手を見つけやすくなります。あなたらしい前向きさを大切にしながら、婚活を楽しんでください。",
  },
  D: {
    typeIntro:
      "「ライフスタイル重視タイプ」は、心地よい距離感とマイペースな日常を大切にする価値観の持ち主です。穏やかな毎日の積み重ねの中に、確かな幸せを見出すタイプです。",
    strengths:
      "あなたの強みは、自分の時間や好きなことを大切にしながらも、相手の自由も尊重できる柔軟さです。感性が豊かで、日常の小さな幸せに気づける力を持っています。無理をせず自然体でいられることは、結婚生活を長く穏やかなものにしてくれます。",
    idealPartner:
      "あなたが幸せになれるのは、お互いの時間や空間を尊重し合いながら、自然体でいられる男性です。仕事に対しても過度にプレッシャーをかけ合わず、それぞれのペースを認め合える相手だと、心地よい関係を築きやすくなります。価値観としては、趣味や日常を一緒に楽しめること、結婚生活では役割を固定しすぎず柔軟に考えられることが大切です。距離感については、程よい自由を認め合いながらも、必要なときは寄り添える関係が理想的です。金銭感覚も、無理のない範囲でお互いのペースを尊重し合える相手だと安心できます。",
    cautions:
      "自由を大切にするあまり、踏み込んだ話し合いを避けてしまうことがあるかもしれません。婚活では、将来のお金や暮らし方について、早い段階で少しずつ本音を共有しておくと、後々のすれ違いを防ぎやすくなります。",
    advice:
      "婚活では、条件よりも「一緒にいて自然体でいられるか」を大切にしてみてください。無理に自分を変えようとせず、あなたらしいペースを大切にできる相手と出会うことが、結婚後の幸せにつながります。焦らず、心地よい距離感で婚活を進めていきましょう。",
  },
};

export const CTA_CONTENT_DEFAULT: CTAContent = {
  heading: "あなたと相性が良い男性を\n実際にご紹介できます。",
  body: "NEST BLANCでは診断結果だけではなく、あなたの価値観に近い男性をご紹介しています。診断結果をもとに、専任カウンセラーがあなたに合うお相手をご提案します。",
  buttonLabel: "無料カウンセリングを予約する",
};

export const ARTICLES_DEFAULT: Article[] = [
  {
    id: "why-values-matter",
    title: "婚活で「価値観」が年収より大切な理由",
    body: "NEST BLANCの成婚データでは、年収や職業の一致よりも、価値観や生活リズムの一致度が結婚後の満足度と強く結びついています。",
  },
];
