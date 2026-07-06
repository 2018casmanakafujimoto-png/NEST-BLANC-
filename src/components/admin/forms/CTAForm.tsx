"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { TextField, TextAreaField, SaveBar } from "@/components/admin/fields";
import { getCTAContent, setCTAContent } from "@/repositories/contentRepository";

export function CTAForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getCTAContent, setCTAContent);

  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  return (
    <section className="flex flex-col gap-3 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">CTA（結果ページ末尾の誘導文）</h2>
      <TextAreaField
        label="見出し"
        value={value.heading}
        onChange={(v) => setValue({ ...value, heading: v })}
        rows={2}
      />
      <TextAreaField label="本文" value={value.body} onChange={(v) => setValue({ ...value, body: v })} rows={3} />
      <TextField
        label="ボタン文言"
        value={value.buttonLabel}
        onChange={(v) => setValue({ ...value, buttonLabel: v })}
      />
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
