"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { SaveBar } from "@/components/admin/fields";
import { getMaleCompatibilityTable, setMaleCompatibilityTable } from "@/repositories/cmsRepository";
import { MALE_TYPE_IDS, MaleTypeId, TYPE_IDS, TypeId } from "@/types/quiz";

export function CompatibilityForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(
    getMaleCompatibilityTable,
    setMaleCompatibilityTable
  );

  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  function updateEntry(femaleId: TypeId, index: number, patch: Partial<{ maleTypeId: MaleTypeId; score: number }>) {
    const entries = [...value![femaleId]];
    entries[index] = { ...entries[index], ...patch };
    setValue({ ...value!, [femaleId]: entries });
  }

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">相性ランキング</h2>
      {TYPE_IDS.map((femaleId) => (
        <div key={femaleId} className="rounded bg-nb-main p-3">
          <p className="mb-2 text-xs font-semibold text-nb-accent">TYPE {femaleId} との相性</p>
          <div className="flex flex-col gap-2">
            {value[femaleId].map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-5 text-xs text-nb-text/50">{index + 1}位</span>
                <select
                  value={entry.maleTypeId}
                  onChange={(e) => updateEntry(femaleId, index, { maleTypeId: e.target.value as MaleTypeId })}
                  className="rounded border border-nb-sub px-2 py-1 text-xs"
                >
                  {MALE_TYPE_IDS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={entry.score}
                  onChange={(e) => updateEntry(femaleId, index, { score: Number(e.target.value) })}
                  className="w-20 rounded border border-nb-sub px-2 py-1 text-xs"
                />
                <span className="text-xs text-nb-text/50">%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
