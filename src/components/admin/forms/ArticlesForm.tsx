"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { TextField, TextAreaField, SaveBar } from "@/components/admin/fields";
import { getArticles, setArticles } from "@/repositories/contentRepository";
import { Article } from "@/types/quiz";

function newArticleId(): string {
  return `article-${Date.now()}`;
}

export function ArticlesForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getArticles, setArticles);

  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  function updateArticle(index: number, patch: Partial<Article>) {
    const next = [...value!];
    next[index] = { ...next[index], ...patch };
    setValue(next);
  }

  function addArticle() {
    setValue([...value!, { id: newArticleId(), title: "", body: "" }]);
  }

  function removeArticle(index: number) {
    setValue(value!.filter((_, i) => i !== index));
  }

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">記事</h2>
      <div className="flex flex-col gap-3">
        {value.map((article, index) => (
          <div key={article.id} className="rounded bg-nb-main p-3">
            <TextField label="タイトル" value={article.title} onChange={(v) => updateArticle(index, { title: v })} />
            <div className="mt-2">
              <TextAreaField label="本文" value={article.body} onChange={(v) => updateArticle(index, { body: v })} />
            </div>
            <button
              onClick={() => removeArticle(index)}
              className="mt-2 text-xs text-red-500 underline"
            >
              削除
            </button>
          </div>
        ))}
      </div>
      <button onClick={addArticle} className="self-start rounded-full border border-nb-accent px-4 py-2 text-xs text-nb-accent">
        記事を追加
      </button>
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
