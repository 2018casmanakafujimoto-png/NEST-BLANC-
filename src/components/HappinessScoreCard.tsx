import { HappinessBreakdown } from "@/types/quiz";

interface Row {
  label: string;
  score: number;
  max: number;
}

interface HappinessScoreCardProps {
  happiness: HappinessBreakdown;
}

export function HappinessScoreCard({ happiness }: HappinessScoreCardProps) {
  const percent = Math.max(0, Math.min(100, happiness.total));

  const rows: Row[] = [
    { label: "価値観一致力", score: happiness.valueAlignment, max: happiness.weights.valueAlignment },
    { label: "結婚準備度", score: happiness.marriageReadiness, max: happiness.weights.marriageReadiness },
    { label: "コミュニケーション", score: happiness.communication, max: happiness.weights.communicationWeight },
    { label: "精神的自立", score: happiness.mentalIndependence, max: happiness.weights.mentalIndependence },
    { label: "パートナー受容力", score: happiness.partnerAcceptance, max: happiness.weights.partnerAcceptance },
  ];

  return (
    <div className="flex flex-col items-center gap-6 rounded-soft bg-white p-6">
      <div
        className="flex h-36 w-36 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(#C98D8D ${percent * 3.6}deg, #EFD7D7 0deg)`,
        }}
      >
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
          <span className="text-3xl font-bold text-nb-accent">{happiness.total}</span>
          <span className="text-xs text-nb-text/60">/ 100点</span>
        </div>
      </div>
      <dl className="grid w-full grid-cols-1 gap-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded bg-nb-main px-4 py-2">
            <dt>{row.label}</dt>
            <dd className="font-semibold text-nb-accent">
              {row.score}/{row.max}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
