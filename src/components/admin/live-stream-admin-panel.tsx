"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface StreamRow {
  id: string;
  title: string;
  status: string;
  scheduledStart: string;
}

export function LiveStreamAdminPanel({ streams }: { streams: StreamRow[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/live-streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description") || undefined,
          scheduledStart: form.get("scheduledStart"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create stream.");
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create stream.");
    } finally {
      setCreating(false);
    }
  }

  async function handleAction(id: string, action: "start" | "stop") {
    setPendingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/live-streams/${id}/${action}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Could not ${action} stream.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not ${action} stream.`);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreate} className="rounded-xl border border-border bg-paper p-5">
        <h2 className="font-medium text-ink">Schedule a Stream</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input name="title" required placeholder="Sunday Service" className="rounded-lg border border-border px-3 py-2 text-sm" />
          <input name="scheduledStart" type="datetime-local" required className="rounded-lg border border-border px-3 py-2 text-sm" />
          <input name="description" placeholder="Description (optional)" className="sm:col-span-2 rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create Stream"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-border bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-tint text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{s.title}</td>
                <td className="px-4 py-3 text-ink-muted">{new Date(s.scheduledStart).toLocaleString()}</td>
                <td className="px-4 py-3 text-ink-muted">{s.status}</td>
                <td className="px-4 py-3">
                  {s.status === "SCHEDULED" && (
                    <button
                      onClick={() => handleAction(s.id, "start")}
                      disabled={pendingId === s.id}
                      className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Go Live
                    </button>
                  )}
                  {s.status === "LIVE" && (
                    <button
                      onClick={() => handleAction(s.id, "stop")}
                      disabled={pendingId === s.id}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink hover:border-accent disabled:opacity-50"
                    >
                      End Stream
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
