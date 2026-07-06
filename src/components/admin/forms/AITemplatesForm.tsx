"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { TextAreaField, SaveBar } from "@/components/admin/fields";
import { getAICommentTemplates, setAICommentTemplates } from "@/repositories/cmsRepository";
import { AICommentTemplateSet, TYPE_IDS, TypeId } from "@/types/quiz";

const SECTION_LABELS: { key: keyof AICommentTemplateSet; label: string }[] = [
  { key: "typeIntro", label: "①タイプ紹介" },
  { key: "strengths", label: "②あなたの強み" },
  { key: "idealPartner", label: "③幸せになれる男性像" },
  { key: "cautions", label: "④婚活で注意するポイント" },
  { key: "advice", label: "⑤今後の婚活アドバイス" },
];

export function AITemplatesForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getAICommentTemplates, setAICommentTemplates);

  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  function updateSection(id: TypeId, key: keyof AICommentTemplateSet, text: string) {
    setValue({ ...value!, [id]: { ...value![id], [key]: text } });
  }

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">AIコメントテンプレート</h2>
      {TYPE_IDS.map((id) => (
        <div key={id} className="flex flex-col gap-2 rounded bg-nb-main p-3">
          <p className="text-xs font-semibold text-nb-accent">TYPE {id}</p>
          {SECTION_LABELS.map(({ key, label }) => (
            <TextAreaField
              key={key}
              label={label}
              value={value[id][key]}
              onChange={(v) => updateSection(id, key, v)}
              rows={3}
            />
          ))}
        </div>
      ))}
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
