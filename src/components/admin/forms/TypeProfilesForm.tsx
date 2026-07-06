"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { TextField, TextAreaField, SaveBar } from "@/components/admin/fields";
import { getTypeProfiles, setTypeProfiles } from "@/repositories/cmsRepository";
import { TYPE_IDS, TypeId, TypeProfile } from "@/types/quiz";

export function TypeProfilesForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getTypeProfiles, setTypeProfiles);

  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  function updateType(id: TypeId, patch: Partial<TypeProfile>) {
    setValue({ ...value!, [id]: { ...value![id], ...patch } });
  }

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">タイプ説明・MBTI表示</h2>
      {TYPE_IDS.map((id) => (
        <div key={id} className="flex flex-col gap-2 rounded bg-nb-main p-3">
          <p className="text-xs font-semibold text-nb-accent">TYPE {id}</p>
          <TextField label="名称" value={value[id].name} onChange={(v) => updateType(id, { name: v })} />
          <TextField label="見出し" value={value[id].headline} onChange={(v) => updateType(id, { headline: v })} />
          <TextAreaField
            label="説明文"
            value={value[id].description}
            onChange={(v) => updateType(id, { description: v })}
          />
          <TextField
            label="参考MBTI（カンマ区切り）"
            value={value[id].mbtiReference.join(", ")}
            onChange={(v) =>
              updateType(id, {
                mbtiReference: v
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
      ))}
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
