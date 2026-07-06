"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { TextField, NumberField, SaveBar } from "@/components/admin/fields";
import { getQuestionsContent, setQuestionsContent } from "@/repositories/questionsRepository";
import { AXES, Question, QuestionOption } from "@/types/quiz";

export function QuestionsForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getQuestionsContent, setQuestionsContent);

  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  function updateQuestion(index: number, patch: Partial<Question>) {
    const next = [...value!];
    next[index] = { ...next[index], ...patch };
    setValue(next);
  }

  function updateOption(qIndex: number, oIndex: number, patch: Partial<QuestionOption>) {
    const options = [...value![qIndex].options];
    options[oIndex] = { ...options[oIndex], ...patch };
    updateQuestion(qIndex, { options });
  }

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">質問・回答・配点</h2>
      <p className="text-xs text-nb-text/60">
        ここでの編集はFirestore上のCMSデータのみを更新します（診断ロジック本体である src/data/questions.ts
        は変更されません）。
      </p>
      <div className="flex flex-col gap-2">
        {value.map((question, qIndex) => (
          <details key={question.id} className="rounded bg-nb-main p-3">
            <summary className="cursor-pointer text-xs font-semibold text-nb-accent">
              Q{question.order}. {question.text}
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              <TextField
                label="質問文"
                value={question.text}
                onChange={(v) => updateQuestion(qIndex, { text: v })}
              />
              {question.options.map((option, oIndex) => (
                <div key={option.key} className="rounded border border-nb-sub bg-white p-2">
                  <p className="mb-2 text-xs font-semibold">{option.key}</p>
                  <TextField
                    label="選択肢文"
                    value={option.text}
                    onChange={(v) => updateOption(qIndex, oIndex, { text: v })}
                  />
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {AXES.map((axis) => (
                      <NumberField
                        key={axis}
                        label={axis}
                        value={option.scores[axis] ?? 0}
                        onChange={(v) =>
                          updateOption(qIndex, oIndex, { scores: { ...option.scores, [axis]: v } })
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
