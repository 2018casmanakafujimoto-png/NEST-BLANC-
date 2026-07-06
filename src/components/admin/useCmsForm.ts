"use client";

import { useCallback, useEffect, useState } from "react";

type Status = "loading" | "idle" | "saving" | "saved" | "error";

/** Shared load/edit/save state machine for every admin form (avoids repeating it per section). */
export function useCmsForm<T>(load: () => Promise<T>, save: (value: T) => Promise<void>) {
  const [value, setValue] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      setValue(await load());
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleSave() {
    if (value === null) return;
    setStatus("saving");
    setError(null);
    try {
      await save(value);
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  return { value, setValue, status, error, handleSave, reload };
}
