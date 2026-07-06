interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="mb-2 text-right text-xs text-nb-accent">
        {current}/{total}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-nb-main">
        <div
          className="h-full rounded-full bg-nb-accent transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
