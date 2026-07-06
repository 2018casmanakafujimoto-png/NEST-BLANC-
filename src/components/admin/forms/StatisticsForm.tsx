"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { NumberField, TextAreaField, SaveBar } from "@/components/admin/fields";
import { getMarriageStats, setMarriageStats } from "@/repositories/cmsRepository";
import { getAllMarriedAverageVectors, setAllMarriedAverageVectors } from "@/repositories/statsRepository";
import { AXES, TYPE_IDS } from "@/types/quiz";

export function MarriageStatsForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getMarriageStats, setMarriageStats);
  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">成婚率・構成比・コメント（統計）</h2>
      {TYPE_IDS.map((id) => (
        <div key={id} className="flex flex-col gap-2 rounded bg-nb-main p-3">
          <p className="text-xs font-semibold text-nb-accent">TYPE {id}</p>
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="構成比 (%)"
              value={value[id].typeShare}
              onChange={(v) => setValue({ ...value, [id]: { ...value[id], typeShare: v } })}
            />
            <NumberField
              label="成婚者に占める割合 (%)"
              value={value[id].marriedShare}
              onChange={(v) => setValue({ ...value, [id]: { ...value[id], marriedShare: v } })}
            />
          </div>
          <TextAreaField
            label="コメント"
            value={value[id].note}
            onChange={(v) => setValue({ ...value, [id]: { ...value[id], note: v } })}
            rows={2}
          />
        </div>
      ))}
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}

export function MarriedVectorsForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(
    getAllMarriedAverageVectors,
    setAllMarriedAverageVectors
  );
  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">成婚女性の平均値ベクトル（類似度計算用・統計）</h2>
      {TYPE_IDS.map((id) => (
        <div key={id} className="rounded bg-nb-main p-3">
          <p className="mb-2 text-xs font-semibold text-nb-accent">TYPE {id}</p>
          <div className="grid grid-cols-2 gap-2">
            {AXES.map((axis) => (
              <NumberField
                key={axis}
                label={axis}
                value={value[id][axis]}
                onChange={(v) => setValue({ ...value, [id]: { ...value[id], [axis]: v } })}
              />
            ))}
          </div>
        </div>
      ))}
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
