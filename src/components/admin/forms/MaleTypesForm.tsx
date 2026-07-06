"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { TextField, NumberField, SaveBar } from "@/components/admin/fields";
import { getMaleTypeProfiles, setMaleTypeProfiles } from "@/repositories/cmsRepository";
import { AXES, MALE_TYPE_IDS, MaleTypeId, MaleTypeProfile } from "@/types/quiz";

export function MaleTypesForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getMaleTypeProfiles, setMaleTypeProfiles);

  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  function updateType(id: MaleTypeId, patch: Partial<MaleTypeProfile>) {
    setValue({ ...value!, [id]: { ...value![id], ...patch } });
  }

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">男性タイプ</h2>
      {MALE_TYPE_IDS.map((id) => (
        <div key={id} className="flex flex-col gap-2 rounded bg-nb-main p-3">
          <p className="text-xs font-semibold text-nb-accent">TYPE {id}</p>
          <TextField label="名称" value={value[id].name} onChange={(v) => updateType(id, { name: v })} />
          <TextField
            label="特徴（カンマ区切り）"
            value={value[id].traits.join(", ")}
            onChange={(v) =>
              updateType(id, {
                traits: v
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            {AXES.map((axis) => (
              <NumberField
                key={axis}
                label={axis}
                value={value[id].axisVector[axis]}
                onChange={(v) =>
                  updateType(id, { axisVector: { ...value![id].axisVector, [axis]: v } })
                }
              />
            ))}
          </div>
        </div>
      ))}
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
