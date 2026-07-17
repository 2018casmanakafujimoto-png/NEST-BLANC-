import { AXES, AxisScores } from "@/types/quiz";

const AXIS_LABELS: Record<(typeof AXES)[number], string> = {
  independence: "自立度",
  communication: "コミュニケーション",
  lifestyle: "ライフスタイル",
  workFamily: "仕事・家庭",
  distance: "距離感",
};

interface Series {
  scores: AxisScores;
  color: string;
  label: string;
}

interface RadarChartProps {
  series: Series[];
  size?: number;
}

/** Minimal dependency-free SVG radar chart for the 5 diagnosis axes. */
export function RadarChart({ series, size = 260 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.36;
  const angleStep = (Math.PI * 2) / AXES.length;

  const pointFor = (axisIndex: number, value: number) => {
    const angle = angleStep * axisIndex - Math.PI / 2;
    const r = (value / 100) * radius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)] as const;
  };

  const ringLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ringLevels.map((level) => (
          <polygon
            key={level}
            points={AXES.map((_, i) => pointFor(i, level * 100).join(",")).join(" ")}
            fill="none"
            stroke="#EFD7D7"
            strokeWidth={1}
          />
        ))}
        {AXES.map((axis, i) => {
          const [x, y] = pointFor(i, 100);
          return (
            <line key={axis} x1={center} y1={center} x2={x} y2={y} stroke="#EFD7D7" strokeWidth={1} />
          );
        })}
        {series.map((s) => (
          <polygon
            key={s.label}
            points={AXES.map((axis, i) => pointFor(i, s.scores[axis]).join(",")).join(" ")}
            fill={s.color}
            fillOpacity={0.25}
            stroke={s.color}
            strokeWidth={2}
          />
        ))}
        {AXES.map((axis, i) => {
          const [x, y] = pointFor(i, 118);
          return (
            <text
              key={axis}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="#444444"
            >
              {AXIS_LABELS[axis]}
            </text>
          );
        })}
      </svg>
      <div className="mt-3 flex gap-4 text-xs">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
