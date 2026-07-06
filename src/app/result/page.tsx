"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RadarChart } from "@/components/RadarChart";
import { HappinessScoreCard } from "@/components/HappinessScoreCard";
import { CompatibilityRanking } from "@/components/CompatibilityRanking";
import { buildDiagnosisResult } from "@/services/diagnosisService";
import { getMaleTypeProfiles } from "@/repositories/cmsRepository";
import { Answer, AxisScores, DiagnosisResult, MaleTypeId, MaleTypeProfile } from "@/types/quiz";

function readAnswers(): Answer[] | null {
  const raw = sessionStorage.getItem("nb-answers");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function ResultPage() {
  const [result, setResult] = useState<DiagnosisResult | null | undefined>(undefined);
  const [maleProfiles, setMaleProfiles] = useState<Record<MaleTypeId, MaleTypeProfile> | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // No answers saved (fresh visit, cleared storage, etc.): never call
    // Firebase in this case, just send the user back to retake the quiz.
    const answers = readAnswers();
    if (!answers) {
      setResult(null);
      return;
    }
    Promise.all([buildDiagnosisResult(answers), getMaleTypeProfiles()])
      .then(([diagnosisResult, profiles]) => {
        setResult(diagnosisResult);
        setMaleProfiles(profiles);
      })
      .catch((error) => {
        console.error("Failed to load diagnosis result:", error);
        setLoadError(true);
      });
  }, []);

  if (loadError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <p>結果を読み込めませんでした。もう一度診断してください。</p>
        <div className="flex gap-3">
          <Link href="/" className="rounded-full border border-nb-accent px-6 py-3 text-nb-accent">
            トップへ戻る
          </Link>
          <Link href="/quiz" className="rounded-full bg-nb-accent px-6 py-3 text-white">
            診断をやり直す
          </Link>
        </div>
      </main>
    );
  }

  if (result === undefined || (result && !maleProfiles)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-nb-accent">結果を読み込んでいます…</p>
      </main>
    );
  }

  if (result === null) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <p>診断結果が見つかりませんでした。</p>
        <Link href="/quiz" className="rounded-full bg-nb-accent px-6 py-3 text-white">
          診断をやり直す
        </Link>
      </main>
    );
  }

  const { profile, scores, topMatch, maleRanking, happiness, similarity, aiComment, marriageStats } = result;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-16 px-6 py-16">
      {/* --- Section 1: type reveal --- */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <p className="text-sm text-nb-accent">あなたの婚活タイプ</p>
        <h1 className="text-2xl font-bold leading-relaxed">「{profile.name}」でした</h1>
        <p className="text-sm leading-loose">{profile.headline}</p>
        <p className="text-sm leading-loose text-nb-text/80">{profile.description}</p>
        <p className="text-xs text-nb-text/50">
          参考MBTI：{profile.mbtiReference.join(" / ")}
          <br />
          （MBTIは参考表示のみで、診断ロジックには使用していません）
        </p>
      </section>

      {/* --- Section 2: radar chart --- */}
      <section className="flex flex-col items-center gap-6 rounded-soft bg-nb-main p-6 text-center">
        <h2 className="text-lg font-medium">婚活価値観レーダーチャート</h2>
        <RadarChart series={[{ scores, color: "#C98D8D", label: "あなた" }]} />
        <dl className="grid w-full grid-cols-2 gap-2 text-left text-xs">
          {(Object.keys(scores) as (keyof AxisScores)[]).map((axis) => (
            <div key={axis} className="flex justify-between rounded bg-white px-3 py-2">
              <dt>{axis}</dt>
              <dd className="font-semibold text-nb-accent">{scores[axis]}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* --- Section 3: compatible partner type --- */}
      <section className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-lg font-medium">あなたと相性が良い男性</h2>
        <RadarChart
          series={[
            { scores, color: "#C98D8D", label: "あなた" },
            { scores: topMatch.profile.axisVector, color: "#8DA9C9", label: topMatch.profile.name },
          ]}
        />
        <p className="text-3xl font-bold text-nb-accent">相性 {topMatch.rankScore}%</p>
        <p className="text-xs text-nb-text/50">価値観・補完性・婚活データ・ライフスタイルを加味した算出スコア：{topMatch.formulaScore}点</p>
        <p className="text-sm leading-loose">
          あなたは「{profile.headline.replace("人", "")}」タイプ。
          <br />
          一方で相性の良い「{topMatch.profile.name}」は、その価値観を補い合える関係を築きやすい傾向があります。
        </p>
      </section>

      {/* --- Section: full compatibility ranking --- */}
      <section className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-lg font-medium">相性ランキング</h2>
        <CompatibilityRanking ranking={maleRanking} profiles={maleProfiles!} />
      </section>

      {/* --- Section 4: ideal partner (from AI comment template) --- */}
      <section className="flex flex-col items-center gap-4 rounded-soft bg-nb-main p-6 text-center">
        <h2 className="text-lg font-medium">あなたへの婚活アドバイス</h2>
        <div className="whitespace-pre-line text-left text-sm leading-loose">{aiComment}</div>
      </section>

      {/* --- Section 6: 婚活幸福度 --- */}
      <section className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-lg font-medium">婚活幸福度</h2>
        <HappinessScoreCard happiness={happiness} />
      </section>

      {/* --- Section 7: NEST BLANC データとの比較 + 成婚女性類似度 --- */}
      <section className="flex flex-col items-center gap-4 rounded-soft bg-nb-sub p-6 text-center">
        <h2 className="text-lg font-medium">NEST BLANC 婚活データとの比較</h2>
        <p className="text-sm leading-loose">
          「{profile.name}」は全体の <span className="font-semibold text-nb-accent">{marriageStats.typeShare}%</span>
          。
          <br />
          このタイプは成婚者全体の
          <span className="font-semibold text-nb-accent"> {marriageStats.marriedShare}%</span> を占めています。
        </p>
        <p className="text-xs leading-relaxed text-nb-text/70">{marriageStats.note}</p>
        <p className="mt-2 text-sm leading-loose">
          あなたは NEST BLANC で成婚された女性の
          <span className="text-xl font-bold text-nb-accent"> {similarity.percent}% </span>
          と似た価値観を持っています。
        </p>
      </section>

      <section className="flex flex-col items-center gap-4 rounded-soft bg-nb-sub p-8 text-center">
        <p className="leading-loose">
          あなたと相性が良い男性を
          <br />
          実際にご紹介できます。
        </p>
        <button className="rounded-full bg-nb-accent px-8 py-4 text-white shadow-sm transition hover:opacity-90">
          無料カウンセリングを予約する
        </button>
      </section>
    </main>
  );
}
