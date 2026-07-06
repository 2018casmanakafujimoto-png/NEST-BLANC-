import { MaleCompatibilityEntry, MaleTypeProfile } from "@/types/quiz";

interface CompatibilityRankingProps {
  ranking: MaleCompatibilityEntry[];
  profiles: Record<string, MaleTypeProfile>;
}

export function CompatibilityRanking({ ranking, profiles }: CompatibilityRankingProps) {
  return (
    <ol className="flex w-full flex-col gap-2">
      {ranking.map((entry, index) => {
        const profile = profiles[entry.maleTypeId];
        return (
          <li
            key={entry.maleTypeId}
            className="flex items-center justify-between rounded-soft bg-white px-4 py-3 text-left text-sm"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nb-accent text-xs text-white">
                {index + 1}
              </span>
              <span>
                <span className="block font-medium">{profile.name}</span>
                <span className="block text-xs text-nb-text/60">{profile.traits.join(" ・ ")}</span>
              </span>
            </span>
            <span className="font-semibold text-nb-accent">{entry.score}%</span>
          </li>
        );
      })}
    </ol>
  );
}
