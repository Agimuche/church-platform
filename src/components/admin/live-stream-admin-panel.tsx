"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Play,
  Square,
  Video,
  ExternalLink,
  Sparkles,
  Check,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  extractStream,
  ExtractedStream,
  TBC_DEFAULT_FACEBOOK_LIVE_URL,
  TBC_DEFAULT_YOUTUBE_LIVE_URL,
  TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
} from "@/lib/utils/stream-extractor";

export interface StreamRow {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  scheduledStart: string;
  provider?: string | null;
  playbackUrl?: string | null;
}

export function LiveStreamAdminPanel({ streams }: { streams: StreamRow[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Extractor state
  const [extractorInput, setExtractorInput] = useState("");
  const [extractedResult, setExtractedResult] = useState<ExtractedStream | null>(null);
  const [extracting, setExtracting] = useState(false);

  // Form input states
  const [title, setTitle] = useState("Sunday Phronesis Service — The Way of the Spirit");
  const [description, setDescription] = useState("Focus scripture, theme, and service outline...");
  const [provider, setProvider] = useState<"facebook" | "youtube" | "mock">("facebook");
  const [playbackUrl, setPlaybackUrl] = useState(TBC_DEFAULT_FACEBOOK_LIVE_URL);

  const [defaultDate] = useState(() =>
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
  );
  const [scheduledStart, setScheduledStart] = useState(defaultDate);

  // Quick extract action
  const handleExtract = async (urlToExtract?: string) => {
    const target = (urlToExtract || extractorInput).trim();
    if (!target) return;

    setExtracting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/streams/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract stream.");

      setExtractedResult(data.stream);
      setSuccess(`Successfully extracted stream from ${data.stream.platformName}!`);

      // Automatically sync to form fields
      if (data.stream.platform === "facebook") {
        setProvider("facebook");
        setPlaybackUrl(data.stream.canonicalUrl);
      } else if (data.stream.platform === "youtube") {
        setProvider("youtube");
        setPlaybackUrl(data.stream.canonicalUrl);
      } else {
        setProvider("mock");
        setPlaybackUrl(data.stream.canonicalUrl);
      }
    } catch (err: any) {
      // Local fallback in case network has a hiccup
      const localResult = extractStream(target);
      setExtractedResult(localResult);
      if (localResult.isValid) {
        setSuccess(`Extracted stream from ${localResult.platformName}!`);
        setPlaybackUrl(localResult.canonicalUrl);
        if (localResult.platform === "facebook") setProvider("facebook");
        else if (localResult.platform === "youtube") setProvider("youtube");
      } else {
        setError(err?.message || "Could not extract stream. Please verify the URL.");
      }
    } finally {
      setExtracting(false);
    }
  };

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/live-streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          scheduledStart,
          provider,
          playbackUrl: playbackUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create stream.");

      setSuccess("Stream scheduled and extracted successfully!");
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
      {/* Quick Launch & Studio Banner */}
      <div className="rounded-3xl border border-border bg-paper p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Multi-Platform Live Engine
              </span>
            </div>
            <h2 className="mt-1 font-serif text-xl font-bold text-ink">
              Live Stream Extraction &amp; Broadcasting Studio
            </h2>
            <p className="mt-1 text-xs text-ink-muted max-w-xl">
              Extract and broadcast live streams from <strong className="text-ink">Facebook Live</strong> and <strong className="text-ink">YouTube Live</strong> simultaneously, or use self-hosted native Cloud HLS/OBS.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/live"
              target="_blank"
              className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition"
            >
              <Video className="h-4 w-4" />
              <span>Open Public Live Room</span>
            </Link>
          </div>
        </div>
      </div>

      {/* STREAM EXTRACTOR TOOL (Facebook & YouTube) */}
      <div className="rounded-3xl border border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <h2 className="font-serif text-base font-bold text-ink">
            Live Stream Extractor (Facebook &amp; YouTube)
          </h2>
        </div>
        <p className="text-xs text-ink-muted mb-4 leading-relaxed">
          Paste any Facebook Live URL (e.g. <code>https://web.facebook.com/thebrookchurchng/live_videos/</code> or video ID) or YouTube Live link to extract the embed stream and prefill the broadcast settings:
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              setExtractorInput(TBC_DEFAULT_FACEBOOK_LIVE_URL);
              handleExtract(TBC_DEFAULT_FACEBOOK_LIVE_URL);
            }}
            className="flex items-center gap-1.5 rounded-full border border-blue-300 dark:border-blue-800 bg-blue-100/70 dark:bg-blue-900/40 px-3.5 py-1.5 text-xs font-bold text-blue-800 dark:text-blue-300 hover:bg-blue-200/80 transition"
          >
            <span>🔵</span>
            <span>Extract The Brook Church Facebook Live</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setExtractorInput(TBC_DEFAULT_YOUTUBE_LIVE_URL);
              handleExtract(TBC_DEFAULT_YOUTUBE_LIVE_URL);
            }}
            className="flex items-center gap-1.5 rounded-full border border-red-300 dark:border-red-800 bg-red-100/70 dark:bg-red-900/40 px-3.5 py-1.5 text-xs font-bold text-red-800 dark:text-red-300 hover:bg-red-200/80 transition"
          >
            <span>🔴</span>
            <span>Extract The Brook Church YouTube Live</span>
          </button>
        </div>

        {/* Extractor Input Field */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={extractorInput}
              onChange={(e) => setExtractorInput(e.target.value)}
              placeholder="e.g. https://web.facebook.com/thebrookchurchng/live_videos/ or YouTube URL"
              className="w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-xs text-ink outline-none transition focus:border-sky-500 shadow-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => handleExtract()}
            disabled={extracting || !extractorInput.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition disabled:opacity-50 shrink-0"
          >
            {extracting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Extracting…</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Extract Stream</span>
              </>
            )}
          </button>
        </div>

        {/* Extracted Preview Card */}
        {extractedResult && (
          <div className="mt-4 rounded-2xl border border-border bg-paper p-4 shadow-xs">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Embed Preview Frame */}
              <div className="relative aspect-video w-full md:w-72 overflow-hidden rounded-xl bg-black border border-border shrink-0">
                {extractedResult.platform === "facebook" ? (
                  extractedResult.hasSpecificVideoId ? (
                    <iframe
                      src={extractedResult.embedUrl}
                      title="Facebook Live Extracted Preview"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}?rel=0&modestbranding=1`}
                        title="Facebook Live Simultaneous Broadcast Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                      <div className="absolute top-2 left-2 z-10 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white shadow">
                        Facebook Simulcast Feed
                      </div>
                    </div>
                  )
                ) : extractedResult.platform === "youtube" ? (
                  <iframe
                    src={extractedResult.embedUrl}
                    title="YouTube Live Extracted Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    Direct Stream Link
                  </div>
                )}
              </div>

              {/* Extracted Details */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] ${
                      extractedResult.platform === "facebook"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {extractedResult.platformName}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="h-3.5 w-3.5" /> Verified Stream
                  </span>
                </div>

                <p className="font-semibold text-ink">
                  Canonical URL:{" "}
                  <a
                    href={extractedResult.canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline break-all"
                  >
                    {extractedResult.canonicalUrl}
                  </a>
                </p>

                <p className="text-ink-muted">
                  Embed Ready URL:{" "}
                  <code className="rounded bg-surface-tint px-1.5 py-0.5 text-[11px] font-mono break-all">
                    {extractedResult.embedUrl.slice(0, 80)}…
                  </code>
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPlaybackUrl(extractedResult.canonicalUrl);
                      if (extractedResult.platform === "facebook") setProvider("facebook");
                      else if (extractedResult.platform === "youtube") setProvider("youtube");
                      setSuccess("Stream settings copied to Schedule Form below!");
                    }}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                  >
                    Apply to Broadcast Form
                  </button>

                  <a
                    href={extractedResult.directWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink transition"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Open in {extractedResult.platformName}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Stream Source / Provider *
            </label>
            <select
              value={provider}
              onChange={(e) => {
                const val = e.target.value as any;
                setProvider(val);
                if (val === "facebook" && !playbackUrl.includes("facebook.com")) {
                  setPlaybackUrl(TBC_DEFAULT_FACEBOOK_LIVE_URL);
                } else if (val === "youtube" && !playbackUrl.includes("youtube.com")) {
                  setPlaybackUrl(TBC_DEFAULT_YOUTUBE_LIVE_URL);
                }
              }}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
            >
              <option value="facebook">📘 Facebook Live (Direct Extract)</option>
              <option value="youtube">🔴 YouTube Live (Direct Extract)</option>
              <option value="mock">⚡ Direct Native HLS / Cloud Feed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Live Stream Playback or Page URL *
            </label>
            <input
              name="playbackUrl"
              value={playbackUrl}
              onChange={(e) => setPlaybackUrl(e.target.value)}
              placeholder="https://web.facebook.com/thebrookchurchng/live_videos/"
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Service Description &amp; Outline
          </label>
          <input
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

      {error && (
        <p className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200">
          {success}
        </p>
      )}

      {/* Streams List Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-paper shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-tint text-[11px] uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Broadcast Title</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Scheduled Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Live Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {streams.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No streams scheduled yet.
                </td>
              </tr>
            ) : (
              streams.map((s) => {
                const isFb =
                  s.provider === "facebook" ||
                  (s.playbackUrl && s.playbackUrl.includes("facebook.com"));
                const isYt =
                  s.provider === "youtube" ||
                  (s.playbackUrl && s.playbackUrl.includes("youtube.com"));

                return (
                  <tr key={s.id} className="hover:bg-surface-tint/50 transition">
                    <td className="px-4 py-3 font-semibold text-ink">
                      <div>{s.title}</div>
                      {s.playbackUrl && (
                        <div className="text-[11px] text-ink-muted font-mono truncate max-w-xs">
                          {s.playbackUrl}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isFb ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                          <span>📘</span> Facebook Live
                        </span>
                      ) : isYt ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-300">
                          <span>🔴</span> YouTube Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          <span>⚡</span> Native Feed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-muted font-mono">
                      {new Date(s.scheduledStart).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          s.status === "LIVE"
                            ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                            : "bg-surface-tint text-ink-muted border border-border"
                        }`}
                      >
                        {s.status === "LIVE" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                        )}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
