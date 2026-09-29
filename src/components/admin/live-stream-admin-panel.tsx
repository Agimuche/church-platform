"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Radio, Play, Square, Video, Link as LinkIcon, Sparkles, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

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
  const [success, setSuccess] = useState("");

  const [defaultDate] = useState(() => new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16));

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/live-streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description") || undefined,
          scheduledStart: form.get("scheduledStart"),
          playbackUrl: form.get("playbackUrl") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create stream.");
      e.currentTarget.reset();
      setSuccess("Stream scheduled successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Could not create stream.");
    } finally {
      setCreating(false);
    }
  }

  async function handleAction(id: string, action: "start" | "stop") {
    setPendingId(id);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/live-streams/${id}/${action}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Could not ${action} stream.`);
      setSuccess(`Stream status updated to ${action === "start" ? "LIVE" : "ENDED"}!`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? `Could not ${action} stream.`);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Quick Launch & Independent Broadcast Studio Banner */}
      <div className="rounded-3xl border border-border bg-paper p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Self-Hosted Live Studio
              </span>
            </div>
            <h2 className="mt-1 font-serif text-xl font-bold text-ink">
              Direct Native Broadcast (No YouTube or Facebook Needed)
            </h2>
            <p className="mt-1 text-xs text-ink-muted max-w-xl">
              Broadcast directly from your church sanctuary using direct Cloud HLS, OBS RTMP, or your browser camera/audio console.
            </p>
          </div>

          <Link
            href="/live"
            target="_blank"
            className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition self-start sm:self-center"
          >
            <Video className="h-4 w-4" />
            <span>Open Live Broadcast Studio</span>
          </Link>
        </div>
      </div>

      {/* Form: Schedule or Configure Stream */}
      <form onSubmit={handleCreate} className="rounded-3xl border border-border bg-paper p-6 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-ink">Schedule a New Service Broadcast</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Service Title *
            </label>
            <input
              name="title"
              required
              defaultValue="Sunday Phronesis Service — The Way of the Spirit"
              placeholder="e.g. Sunday Phronesis Service"
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Date &amp; Scheduled Start *
            </label>
            <input
              name="scheduledStart"
              type="datetime-local"
              required
              defaultValue={defaultDate}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Direct Stream Playback URL (HLS .m3u8, MP4, or WebRTC stream)
          </label>
          <input
            name="playbackUrl"
            placeholder="e.g. https://stream.your-domain.com/live/service.m3u8 (optional)"
            className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
          />
          <p className="mt-1 text-[11px] text-ink-muted">
            Leave blank to use the native browser Studio Cam or church cloud feed.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Service Description &amp; Outline
          </label>
          <input
            name="description"
            placeholder="Focus scripture, theme, and service outline..."
            className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition disabled:opacity-50"
        >
          {creating ? "Scheduling…" : "Schedule Service"}
        </button>
      </form>

      {error && <p className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200">{error}</p>}
      {success && <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200">{success}</p>}

      {/* Streams List Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-paper shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-tint text-[11px] uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Broadcast Title</th>
              <th className="px-4 py-3">Scheduled Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Live Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {streams.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                  No streams scheduled yet.
                </td>
              </tr>
            ) : (
              streams.map((s) => (
                <tr key={s.id} className="hover:bg-surface-tint/50 transition">
                  <td className="px-4 py-3 font-semibold text-ink">{s.title}</td>
                  <td className="px-4 py-3 text-ink-muted font-mono">{new Date(s.scheduledStart).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        s.status === "LIVE"
                          ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                          : "bg-surface-tint text-ink-muted border border-border"
                      }`}
                    >
                      {s.status === "LIVE" && <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/live"
                        target="_blank"
                        className="rounded-lg p-1.5 text-ink-muted hover:text-accent transition"
                        title="View Live Room"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      {s.status === "SCHEDULED" && (
                        <button
                          onClick={() => handleAction(s.id, "start")}
                          disabled={pendingId === s.id}
                          className="flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Go Live</span>
                        </button>
                      )}
                      {s.status === "LIVE" && (
                        <button
                          onClick={() => handleAction(s.id, "stop")}
                          disabled={pendingId === s.id}
                          className="flex items-center gap-1.5 rounded-full border border-border bg-paper px-3.5 py-1 text-xs font-bold text-ink hover:bg-surface-tint disabled:opacity-50 transition"
                        >
                          <Square className="h-3 w-3 fill-current text-red-500" />
                          <span>End Stream</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
