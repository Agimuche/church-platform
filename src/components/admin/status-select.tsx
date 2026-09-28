"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StatusSelect({
  id,
  currentStatus,
  options,
  endpoint,
}: {
  id: string;
  currentStatus: string;
  options: string[];
  endpoint: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSaving(true);
    await fetch(`${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={saving}
      className="rounded-full border border-border bg-paper px-3 py-1 text-xs"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
