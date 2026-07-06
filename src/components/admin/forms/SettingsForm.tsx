"use client";

import { useCmsForm } from "@/components/admin/useCmsForm";
import { NumberField, SaveBar } from "@/components/admin/fields";
import {
  getCompatibilityFormulaWeights,
  setCompatibilityFormulaWeights,
  getHappinessWeights,
  setHappinessWeights,
} from "@/repositories/cmsRepository";

export function HappinessWeightsForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(getHappinessWeights, setHappinessWeights);
  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  const total =
    value.valueAlignment + value.marriageReadiness + value.communicationWeight + value.mentalIndependence + value.partnerAcceptance;

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">婚活幸福度 配点（設定）</h2>
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="価値観一致力"
          value={value.valueAlignment}
          onChange={(v) => setValue({ ...value, valueAlignment: v })}
        />
        <NumberField
          label="結婚準備度"
          value={value.marriageReadiness}
          onChange={(v) => setValue({ ...value, marriageReadiness: v })}
        />
        <NumberField
          label="コミュニケーション"
          value={value.communicationWeight}
          onChange={(v) => setValue({ ...value, communicationWeight: v })}
        />
        <NumberField
          label="精神的自立"
          value={value.mentalIndependence}
          onChange={(v) => setValue({ ...value, mentalIndependence: v })}
        />
        <NumberField
          label="パートナー受容力"
          value={value.partnerAcceptance}
          onChange={(v) => setValue({ ...value, partnerAcceptance: v })}
        />
      </div>
      <p className={`text-xs ${total === 100 ? "text-nb-text/50" : "text-red-500"}`}>合計: {total} / 100</p>
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}

export function CompatibilityWeightsForm() {
  const { value, setValue, status, error, handleSave } = useCmsForm(
    getCompatibilityFormulaWeights,
    setCompatibilityFormulaWeights
  );
  if (!value) return <p className="text-xs text-nb-text/60">読み込み中…</p>;

  const total = value.valueMatch + value.complementarity + value.dataMatch + value.lifestyleMatch;

  return (
    <section className="flex flex-col gap-4 rounded-soft border border-nb-sub bg-white p-5">
      <h2 className="font-medium">相性計算の重み（設定）</h2>
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="価値観一致率"
          value={value.valueMatch}
          onChange={(v) => setValue({ ...value, valueMatch: v })}
        />
        <NumberField
          label="補完性"
          value={value.complementarity}
          onChange={(v) => setValue({ ...value, complementarity: v })}
        />
        <NumberField
          label="婚活データ一致率"
          value={value.dataMatch}
          onChange={(v) => setValue({ ...value, dataMatch: v })}
        />
        <NumberField
          label="ライフスタイル一致率"
          value={value.lifestyleMatch}
          onChange={(v) => setValue({ ...value, lifestyleMatch: v })}
        />
      </div>
      <p className={`text-xs ${total === 100 ? "text-nb-text/50" : "text-red-500"}`}>合計: {total} / 100</p>
      <SaveBar status={status} error={error} onSave={handleSave} />
    </section>
  );
}
