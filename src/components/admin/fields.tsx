interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ label, value, onChange }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-nb-text/60">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-nb-sub px-3 py-2 text-sm"
      />
    </label>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function TextAreaField({ label, value, onChange, rows = 4 }: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-nb-text/60">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="rounded border border-nb-sub px-3 py-2 text-sm"
      />
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-nb-text/60">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border border-nb-sub px-3 py-2 text-sm"
      />
    </label>
  );
}

interface SaveBarProps {
  status: string;
  error: string | null;
  onSave: () => void;
}

export function SaveBar({ status, error, onSave }: SaveBarProps) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onSave} className="rounded-full bg-nb-accent px-4 py-2 text-xs text-white">
        保存
      </button>
      {status === "saving" && <span className="text-xs text-nb-text/60">保存中…</span>}
      {status === "saved" && <span className="text-xs text-nb-accent">保存しました</span>}
      {status === "error" && <span className="text-xs text-red-500">エラー: {error}</span>}
    </div>
  );
}
