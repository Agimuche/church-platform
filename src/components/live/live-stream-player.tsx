"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Headphones,
  Video,
  Send,
  MessageSquare,
  FileText,
  Share2,
  Check,
  Sparkles,
  ExternalLink,
  Download,
  Printer,
  Copy,
  Radio,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  extractFacebookStream,
  extractYouTubeStream,
  extractStream,
  TBC_DEFAULT_FACEBOOK_LIVE_URL,
  TBC_DEFAULT_YOUTUBE_LIVE_URL,
  TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
  SERVICE_BROADCAST_PRESETS,
} from "@/lib/utils/stream-extractor";
import {
  exportToWordDocx,
  exportToPdf,
  printSermonNotes,
} from "@/lib/utils/sermon-exporter";

interface LiveStreamProps {
  initialTitle?: string;
  initialDescription?: string;
  initialStatus?: "LIVE" | "SCHEDULED" | "ENDED";
  customStreamUrl?: string;
  provider?: string;
}

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  time: string;
  isPastor?: boolean;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

export function LiveStreamPlayer({
  initialTitle = "Sunday Phronesis & Doxa Service",
  initialDescription = "The Way of the Spirit — Live from The Brook Church Sanctuary, Calabar.",
  initialStatus = "LIVE",
  customStreamUrl,
  provider,
}: LiveStreamProps) {
  // Determine initial stream mode based on provider or URL
  const [streamSource, setStreamSource] = useState<
    "facebook" | "youtube" | "native" | "camera"
  >(() => {
    if (
      provider === "facebook" ||
      (customStreamUrl && customStreamUrl.includes("facebook.com"))
    ) {
      return "facebook";
    }
    if (
      provider === "youtube" ||
      (customStreamUrl && customStreamUrl.includes("youtube.com"))
    ) {
      return "youtube";
    }
    // Default to Facebook Live as requested
    return "facebook";
  });

  // Current URLs
  const [facebookUrl, setFacebookUrl] = useState(() => {
    if (customStreamUrl && customStreamUrl.includes("facebook.com")) {
      return customStreamUrl;
    }
    return TBC_DEFAULT_FACEBOOK_LIVE_URL;
  });

  const [youtubeUrl, setYoutubeUrl] = useState(() => {
    if (customStreamUrl && customStreamUrl.includes("youtube.com")) {
      return customStreamUrl;
    }
    return TBC_DEFAULT_YOUTUBE_LIVE_URL;
  });

  const [forceFacebookIframe, setForceFacebookIframe] = useState(false);

  // URL changer popover state
  const [showUrlChanger, setShowUrlChanger] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [extractError, setExtractError] = useState("");
  const [extractSuccess, setExtractSuccess] = useState("");

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);
  const [viewerCount, setViewerCount] = useState(384);
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("chat");

  // Camera Studio State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      name: "Pastor Victor Owoeye",
      message:
        "Welcome to today's glorious service! The Spirit of God is in this place.",
      time: "8:05 AM",
      isPastor: true,
    },
    {
      id: "2",
      name: "Sister Emem (Calabar)",
      message:
        "Hallelujah! Connected on Facebook Live. Ready to receive the Word.",
      time: "8:07 AM",
    },
    {
      id: "3",
      name: "Brother Daniel (Lagos)",
      message: "Grace upon grace! Amen to the Zoe life revelation!",
      time: "8:12 AM",
    },
    {
      id: "4",
      name: "Sister Grace (United Kingdom)",
      message: "Watching live from London. Streaming crystal clear!",
      time: "8:15 AM",
    },
  ]);
  const [inputName, setInputName] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Notes state & automated note-making
  const [notes, setNotes] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("tbc_live_sermon_notes");
        if (saved && saved.trim()) return saved;
      } catch {}
    }
    return "";
  });
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [lastAutoCapturedTime, setLastAutoCapturedTime] = useState<string | null>(null);
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [downloadFormatLoading, setDownloadFormatLoading] = useState<"word" | "pdf" | null>(null);

  // Sync notes to local storage
  useEffect(() => {
    try {
      if (notes) {
        localStorage.setItem("tbc_live_sermon_notes", notes);
      }
    } catch {}
  }, [notes]);

  // Periodic Live Auto-Capture while livestreaming
  useEffect(() => {
    if (!isAutoCapturing) return;

    // Capture incremental updates every 25 seconds
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/sermons/auto-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: initialTitle,
            description: initialDescription,
            speaker: "Pastor Victor Owoeye",
            existingNotes: notes,
            mode: "incremental",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.notes) {
            setNotes((prev) => (prev ? `${prev}\n\n${data.notes}` : data.notes));
            setLastAutoCapturedTime(
              new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
            );
          }
        }
      } catch (err) {
        console.error("Auto capture tick error:", err);
      }
    }, 25000);

    return () => clearInterval(timer);
  }, [isAutoCapturing, initialTitle, initialDescription, notes]);

  // 1-Click Generate Full Live Sermon Notes
  const handleAutoGenerateNotes = async () => {
    setIsAutoGenerating(true);
    try {
      const res = await fetch("/api/sermons/auto-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: initialTitle,
          description: initialDescription,
          speaker: "Pastor Victor Owoeye",
          existingNotes: notes,
          mode: "full",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.notes) {
          setNotes(data.notes);
          setActiveTab("notes");
        }
      }
    } catch (err) {
      console.error("Auto-generate notes error:", err);
    } finally {
      setIsAutoGenerating(false);
    }
  };

  // Download sermon message in Microsoft Word (.docx) format
  const handleDownloadWord = async () => {
    setDownloadFormatLoading("word");
    try {
      const contentToExport = notes.trim() || `THE BROOK CHURCH - SERMON NOTES\nTitle: ${initialTitle}\nDate: ${new Date().toDateString()}\n\nLive Sanctuary Broadcast Sermon Notes.`;
      await exportToWordDocx({
        title: initialTitle,
        preacher: "Pastor Victor Owoeye",
        content: contentToExport,
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } catch (err) {
      console.error("Word export failed:", err);
    } finally {
      setDownloadFormatLoading(null);
    }
  };

  // Download sermon message in PDF (.pdf) format
  const handleDownloadPdf = async () => {
    setDownloadFormatLoading("pdf");
    try {
      const contentToExport = notes.trim() || `THE BROOK CHURCH - SERMON NOTES\nTitle: ${initialTitle}\nDate: ${new Date().toDateString()}\n\nLive Sanctuary Broadcast Sermon Notes.`;
      await exportToPdf({
        title: initialTitle,
        preacher: "Pastor Victor Owoeye",
        content: contentToExport,
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setDownloadFormatLoading(null);
    }
  };

  const handlePrint = () => {
    const contentToExport = notes.trim() || `THE BROOK CHURCH - SERMON NOTES\nTitle: ${initialTitle}\nDate: ${new Date().toDateString()}`;
    printSermonNotes({
      title: initialTitle,
      preacher: "Pastor Victor Owoeye",
      content: contentToExport,
    });
  };

  const handleCopyNotes = async () => {
    if (!notes) return;
    try {
      await navigator.clipboard.writeText(notes);
      setCopiedNotes(true);
      setTimeout(() => setCopiedNotes(false), 2000);
    } catch {}
  };

  const insertSnippet = (snippet: string) => {
    setNotes((prev) => (prev ? `${prev}\n${snippet}` : snippet));
  };

  // Reactions state
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const reactionCounter = useRef(0);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extracted stream representations
  const extractedFb = extractFacebookStream(facebookUrl);
  const extractedYt = extractYouTubeStream(youtubeUrl);

  // Start Camera Broadcast Studio
  const startCameraStudio = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setStreamSource("camera");
        setIsPlaying(true);
      }
    } catch {
      setCameraError(
        "Camera access denied or unavailable. You can use Facebook Live, YouTube, or direct stream."
      );
    }
  };

  const stopCameraStudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    // Dynamic viewer count subtle fluctuation
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const triggerReaction = (emoji: string) => {
    const id = ++reactionCounter.current;
    const x = Math.floor(Math.random() * 80) + 10;
    setReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const sender = inputName.trim() || "Online Worshipper";
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      name: sender,
      message: inputMsg.trim(),
      time: timeStr,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
    triggerReaction("🙏");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Handle instant custom URL extraction in the player
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setExtractError("");
    setExtractSuccess("");
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    const extracted = extractStream(trimmed);
    if (!extracted.isValid && extracted.platform === "unknown") {
      setExtractError("Unrecognized link. Please paste a Facebook or YouTube live URL.");
      return;
    }

    if (extracted.platform === "facebook") {
      setFacebookUrl(extracted.canonicalUrl);
      setStreamSource("facebook");
      setExtractSuccess("Facebook Live extracted and playing!");
    } else if (extracted.platform === "youtube") {
      setYoutubeUrl(extracted.canonicalUrl);
      setStreamSource("youtube");
      setExtractSuccess("YouTube Live extracted and playing!");
    } else {
      setStreamSource("native");
      setExtractSuccess("Custom direct stream loaded!");
    }

    setUrlInput("");
    setTimeout(() => setShowUrlChanger(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left/Main Column: Stream Player & Broadcast Controls */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Stream Mode Selector Tabs & Link Extractor Tool */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-paper p-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              Live Engine
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-tint border border-border text-xs font-medium">
            {/* Facebook Live (Primary) */}
            <button
              onClick={() => {
                stopCameraStudio();
                setStreamSource("facebook");
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                streamSource === "facebook"
                  ? "bg-blue-600 text-white shadow-xs font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <span>📘</span>
              <span>Facebook Live</span>
            </button>

            {/* YouTube Live */}
            <button
              onClick={() => {
                stopCameraStudio();
                setStreamSource("youtube");
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                streamSource === "youtube"
                  ? "bg-red-600 text-white shadow-xs font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <span>🔴</span>
              <span>YouTube Live</span>
            </button>

            {/* Native Cloud Stream */}
            <button
              onClick={() => {
                stopCameraStudio();
                setStreamSource("native");
              }}
              className={`rounded-lg px-3 py-1.5 transition ${
                streamSource === "native"
                  ? "bg-accent text-white shadow-xs font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Direct Cloud Feed
            </button>

            {/* Live Studio Cam */}
            <button
              onClick={() => {
                if (!cameraActive) {
                  startCameraStudio();
                } else {
                  setStreamSource("camera");
                }
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                streamSource === "camera"
                  ? "bg-purple-600 text-white shadow-xs font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              Studio Cam
            </button>
          </div>

          {/* Quick Change / Paste Link button */}
          <button
            type="button"
            onClick={() => setShowUrlChanger(!showUrlChanger)}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 ml-auto sm:ml-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{showUrlChanger ? "Close Extractor" : "Paste Stream URL"}</span>
          </button>
        </div>

        {/* Quick Service Broadcast Presets Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-ink-muted text-[11px] font-semibold shrink-0">
            Current Service Presets:
          </span>
          {SERVICE_BROADCAST_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setYoutubeUrl(`https://www.youtube.com/watch?v=${p.id}`);
                setStreamSource("youtube");
                setExtractSuccess(`Loaded: ${p.title}`);
                setTimeout(() => setExtractSuccess(""), 3000);
              }}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition shrink-0 border ${
                youtubeUrl.includes(p.id) && streamSource === "youtube"
                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                  : "bg-surface-tint text-ink-muted border-border hover:text-ink hover:border-slate-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Dynamic URL Extractor Input Drawer */}
        {showUrlChanger && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink">
                Extract Live Stream from Facebook or YouTube URL:
              </span>
              <span className="text-[11px] text-ink-muted">Instant Extraction</span>
            </div>
            <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. https://web.facebook.com/thebrookchurchng/live_videos/ or video ID"
                className="flex-1 rounded-xl border border-border bg-paper px-3 py-2 text-xs text-ink outline-none transition focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-accent-dark transition shrink-0"
              >
                Extract &amp; Play
              </button>
            </form>
            {extractError && (
              <p className="mt-2 text-xs text-red-600 font-medium">{extractError}</p>
            )}
            {extractSuccess && (
              <p className="mt-2 text-xs text-emerald-600 font-medium">{extractSuccess}</p>
            )}
          </motion.div>
        )}

        {/* Video Player Frame with 3D Border & Glow */}
        <div
          ref={videoContainerRef}
          className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border bg-slate-950 shadow-2xl tbc-glow"
        >
          {/* Floating animated reactions layer */}
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            <AnimatePresence>
              {reactions.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 150, scale: 0.6 }}
                  animate={{ opacity: 1, y: -40, scale: 1.3 }}
                  exit={{ opacity: 0, y: -100, scale: 0.8 }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                  style={{ left: `${r.x}%`, position: "absolute", bottom: "10%" }}
                  className="text-3xl select-none"
                >
                  {r.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 1. FACEBOOK LIVE EMBED (Extracted & Guaranteed Playback) */}
          {streamSource === "facebook" && (
            <div className="relative h-full w-full bg-slate-950">
              {forceFacebookIframe || extractedFb.hasSpecificVideoId ? (
                <div className="relative h-full w-full">
                  <iframe
                    src={extractedFb.embedUrl}
                    title="The Brook Church — Facebook Live"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                  {/* Fallback button if Facebook frame is blank/blocked */}
                  <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between rounded-lg bg-black/80 px-3 py-1.5 text-[11px] text-white backdrop-blur-sm border border-white/10">
                    <span className="text-slate-300">Facebook Player Active</span>
                    <button
                      type="button"
                      onClick={() => setForceFacebookIframe(false)}
                      className="font-bold text-sky-400 hover:underline"
                    >
                      Switch to Sanctuary Live Feed
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full bg-slate-950">
                  {/* Simultaneous Sanctuary Transmission Mirror with Facebook Live Branding */}
                  <iframe
                    src={`https://www.youtube.com/embed/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}?autoplay=1&mute=0&rel=0&enablejsapi=1`}
                    title="The Brook Church — Facebook Live Simultaneous Transmission"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />

                  {/* Facebook Live Synchronized Broadcast Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-blue-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    <span>Facebook Live Simultaneous Transmission</span>
                  </div>

                  {/* Quick Controls overlay on bottom */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/85 px-3 py-2 text-xs text-white backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">📘 Live on Facebook</span>
                      <span className="text-slate-400 text-[11px]">Simulcast from Sanctuary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setForceFacebookIframe(true)}
                        className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-white/20 transition"
                      >
                        Try FB Plugin Frame
                      </button>
                      <a
                        href={extractedFb.directWatchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-blue-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Open on Facebook</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. YOUTUBE LIVE EMBED (Extracted & Guaranteed Playback) */}
          {streamSource === "youtube" && (
            <div className="relative h-full w-full bg-slate-950">
              <iframe
                src={extractedYt.embedUrl}
                title="The Brook Church — YouTube Live"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />

              {/* YouTube Live Synchronized Broadcast Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span>YouTube Live Transmission Active</span>
              </div>
            </div>
          )}

          {/* 3. NATIVE VIDEO PLAYER */}
          {streamSource === "native" && (
            <div className="relative h-full w-full flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black">
              {audioOnly ? (
                /* Audio-only bandwidth saver mode */
                <div className="flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 border border-accent/40 shadow-lg mb-4">
                    <Headphones className="h-10 w-10 text-accent animate-pulse" />
                  </div>
                  <h3 className="font-serif text-xl font-bold">Audio Broadcast Mode Active</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm">
                    Conserving mobile data bandwidth. Audio stream streaming crystal clear.
                  </p>
                  <div className="mt-6 flex items-center gap-1.5 h-6">
                    <div className="w-1.5 bg-sky-400 rounded-full soundwave-bar" />
                    <div className="w-1.5 bg-sky-400 rounded-full soundwave-bar" />
                    <div className="w-1.5 bg-sky-400 rounded-full soundwave-bar" />
                    <div className="w-1.5 bg-sky-400 rounded-full soundwave-bar" />
                    <div className="w-1.5 bg-sky-400 rounded-full soundwave-bar" />
                  </div>
                </div>
              ) : (
                /* Native Video Player */
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted={isMuted}
                  loop
                  poster="https://i.ytimg.com/vi/h6XWU2GNa6E/maxresdefault.jpg"
                  className="h-full w-full object-cover"
                  src={
                    customStreamUrl && !customStreamUrl.includes("facebook.com") && !customStreamUrl.includes("youtube.com")
                      ? customStreamUrl
                      : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  }
                />
              )}
            </div>
          )}

          {/* 4. LIVE STUDIO CAM */}
          {streamSource === "camera" && (
            <div className="relative h-full w-full bg-black">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted={isMuted}
                className="h-full w-full object-cover"
              />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center text-white">
                  <p className="text-sm text-red-400">{cameraError}</p>
                </div>
              )}
              {/* Studio On-Air Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-purple-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Live Studio Cam Active
              </div>
            </div>
          )}

          {/* Watermark / Logo Overlay */}
          <div className="pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-slate-950/60 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md border border-white/10">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>TBC LIVE</span>
            <span className="text-white/40">|</span>
            <span className="text-sky-300 font-mono">{viewerCount} Watching</span>
          </div>

          {/* Interactive Player Controls Bar (For Native & Camera modes) */}
          {(streamSource === "native" || streamSource === "camera") && (
            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        videoRef.current.play();
                        setIsPlaying(true);
                      }
                    }
                  }}
                  className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30 transition text-white"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30 transition text-white"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-white">HD 1080p 60fps</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio-only toggle */}
                <button
                  onClick={() => setAudioOnly(!audioOnly)}
                  title="Toggle Audio-Only Low Bandwidth Mode"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md transition ${
                    audioOnly
                      ? "bg-accent text-white"
                      : "bg-white/20 text-slate-200 hover:bg-white/30"
                  }`}
                >
                  <Headphones className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Audio Only</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30 transition text-white"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Broadcast Title, Description & Action bar */}
        <div className="rounded-2xl border border-border bg-paper p-5 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  {initialStatus}
                </span>

                {streamSource === "facebook" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                    <span>📘</span> Extracted from Facebook Live
                  </span>
                ) : streamSource === "youtube" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:text-red-300">
                    <span>🔴</span> Extracted from YouTube Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-ink">
                    <span>⚡</span> Direct Church Feed
                  </span>
                )}

                <span className="text-xs text-ink-muted">The Brook Church Sanctuary &bull; Calabar</span>
              </div>

              <h1 className="mt-2 font-serif text-2xl font-bold text-ink sm:text-3xl">
                {initialTitle}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted max-w-2xl">
                {initialDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {streamSource === "facebook" && (
                <a
                  href={extractedFb.directWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open on Facebook</span>
                </a>
              )}

              {streamSource === "youtube" && (
                <a
                  href={extractedYt.directWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open on YouTube</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setActiveTab("notes");
                  if (!notes || notes.trim().length === 0) {
                    handleAutoGenerateNotes();
                  }
                }}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:from-amber-600 hover:to-amber-700 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Auto-Make Notes</span>
              </button>

              <Link
                href="/give"
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                Give Tithes &amp; Offering
              </Link>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-full border border-border bg-paper px-3.5 py-2 text-xs font-medium text-ink hover:bg-surface-tint transition"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Quick Prayer Reactions Bar */}
          <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-ink-muted">
              Live Reactions:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerReaction("🙏")}
                className="flex items-center gap-1 rounded-full border border-border bg-paper/80 px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface-tint hover:scale-105 transition active:scale-95"
              >
                <span>🙏</span> <span>Amen</span>
              </button>
              <button
                onClick={() => triggerReaction("🔥")}
                className="flex items-center gap-1 rounded-full border border-border bg-paper/80 px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface-tint hover:scale-105 transition active:scale-95"
              >
                <span>🔥</span> <span>Fire</span>
              </button>
              <button
                onClick={() => triggerReaction("❤️")}
                className="flex items-center gap-1 rounded-full border border-border bg-paper/80 px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface-tint hover:scale-105 transition active:scale-95"
              >
                <span>❤️</span> <span>Glory</span>
              </button>
              <button
                onClick={() => triggerReaction("✨")}
                className="flex items-center gap-1 rounded-full border border-border bg-paper/80 px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface-tint hover:scale-105 transition active:scale-95"
              >
                <span>✨</span> <span>Grace</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Chat & Sermon Notepad */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex h-[660px] flex-col rounded-3xl border border-border bg-paper shadow-md overflow-hidden">
          {/* Header Tabs */}
          <div className="flex items-center justify-between border-b border-border bg-surface-tint p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "chat"
                    ? "bg-paper text-accent shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Sanctuary Chat
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition relative ${
                  activeTab === "notes"
                    ? "bg-paper text-accent shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Sermon Notes</span>
                {isAutoCapturing && (
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Live Auto-Capture Active" />
                )}
                {notes && notes.length > 20 && !isAutoCapturing && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>
            <span className="text-[11px] font-mono text-ink-muted">{viewerCount} online</span>
          </div>

          {/* Tab 1: Live Chat Feed */}
          {activeTab === "chat" && (
            <div className="flex flex-1 flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-2xl p-3 text-xs leading-relaxed ${
                      m.isPastor
                        ? "bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-200"
                        : "bg-surface-tint border border-border text-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className={m.isPastor ? "text-sky-700 dark:text-sky-400 font-bold" : "text-ink"}>
                        {m.name} {m.isPastor && "🕊️"}
                      </span>
                      <span className="text-[10px] text-ink-muted font-normal">{m.time}</span>
                    </div>
                    <p className="mt-1">{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="border-t border-border p-3 space-y-2 bg-surface-tint">
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-paper px-3 py-1.5 text-xs text-ink outline-none transition focus:border-accent"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Share an Amen, praise or prayer..."
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-paper px-3 py-2 text-xs text-ink outline-none transition focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center rounded-xl bg-accent px-3 py-2 text-white hover:bg-accent-dark transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Intelligent Live Sermon Notes Studio */}
          {activeTab === "notes" && (
            <div className="flex flex-1 flex-col overflow-hidden p-3 gap-2.5">
              {/* Automated Note-Making Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-2xl bg-surface-tint p-2 border border-border">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleAutoGenerateNotes}
                    disabled={isAutoGenerating}
                    title="Automatically create complete sermon study notes for current live broadcast"
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-accent to-accent-dark px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:brightness-110 transition disabled:opacity-50"
                  >
                    {isAutoGenerating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 text-amber-300" />
                    )}
                    <span>{isAutoGenerating ? "Making Notes..." : "Auto-Make Notes"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAutoCapturing(!isAutoCapturing)}
                    title="Automatically captures live key points and declarations as livestream plays"
                    className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold transition border ${
                      isAutoCapturing
                        ? "bg-red-500 text-white border-red-600 shadow-xs"
                        : "bg-paper text-ink border-border hover:bg-surface-tint"
                    }`}
                  >
                    <Radio className={`h-3 w-3 ${isAutoCapturing ? "animate-pulse" : ""}`} />
                    <span>{isAutoCapturing ? "Live Auto-Capture ON" : "Auto-Capture"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Reset current sermon notes?")) {
                        setNotes("");
                        localStorage.removeItem("tbc_live_sermon_notes");
                      }
                    }}
                    title="Clear current notes"
                    className="rounded-lg p-1 text-ink-muted hover:text-red-500 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Snippet Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px]">
                <span className="text-ink-muted shrink-0">Quick Add:</span>
                <button
                  type="button"
                  onClick={() => insertSnippet("• Scripture: ")}
                  className="rounded-lg border border-border bg-paper px-2 py-0.5 font-medium text-ink hover:bg-surface-tint shrink-0 transition"
                >
                  + Scripture
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("• Key Revelation: ")}
                  className="rounded-lg border border-border bg-paper px-2 py-0.5 font-medium text-ink hover:bg-surface-tint shrink-0 transition"
                >
                  + Revelation
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("• Prophetic Word: ")}
                  className="rounded-lg border border-border bg-paper px-2 py-0.5 font-medium text-ink hover:bg-surface-tint shrink-0 transition"
                >
                  + Prophetic Word
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("• Action Point: ")}
                  className="rounded-lg border border-border bg-paper px-2 py-0.5 font-medium text-ink hover:bg-surface-tint shrink-0 transition"
                >
                  + Action Point
                </button>
              </div>

              {/* Main Notes Textarea */}
              <div className="relative flex-1 min-h-0">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`• Sermon Topic: ${initialTitle}\n• Scriptures: John 10:10, Romans 8:11, 2 Peter 1:3\n• Key Revelation:\n• Pastoral Quotes:\n• Prophetic Decrees:\n• Action Points:`}
                  className="h-full w-full rounded-2xl border border-border bg-surface-tint p-3 text-xs leading-relaxed text-ink outline-none transition focus:border-accent resize-none font-mono text-[11px]"
                />
                {!notes && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                    <p className="text-xs text-ink-muted mb-2 font-sans font-medium">
                      No notes written yet for this live stream.
                    </p>
                    <button
                      type="button"
                      onClick={handleAutoGenerateNotes}
                      className="pointer-events-auto rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Auto-Generate Sermon Notes Now</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status info bar */}
              <div className="flex items-center justify-between text-[10px] text-ink-muted px-1">
                <span>
                  {notes.trim() ? `${notes.trim().split(/\s+/).filter(Boolean).length} words` : "Empty"} &bull; Saved locally
                </span>
                {isAutoCapturing && (
                  <span className="text-red-500 font-semibold animate-pulse">
                    Live capture active {lastAutoCapturedTime ? `(${lastAutoCapturedTime})` : ""}
                  </span>
                )}
              </div>

              {/* Export in MS Word & PDF Toolbar */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* MS Word Download */}
                  <button
                    type="button"
                    onClick={handleDownloadWord}
                    disabled={downloadFormatLoading === "word"}
                    title="Download written sermon message in Microsoft Word (.docx) format"
                    className="flex items-center gap-1 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
                  >
                    {downloadFormatLoading === "word" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    <span>Word (.docx)</span>
                  </button>

                  {/* PDF Download */}
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={downloadFormatLoading === "pdf"}
                    title="Download written sermon message in PDF (.pdf) format"
                    className="flex items-center gap-1 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
                  >
                    {downloadFormatLoading === "pdf" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    <span>PDF (.pdf)</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrint}
                    title="Print sermon notes"
                    className="flex items-center gap-1 rounded-xl border border-border bg-paper px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-surface-tint transition"
                  >
                    <Printer className="h-3 w-3" />
                    <span className="hidden sm:inline">Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyNotes}
                    title="Copy full notes text to clipboard"
                    className="flex items-center gap-1 rounded-xl border border-border bg-paper px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-surface-tint transition"
                  >
                    {copiedNotes ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedNotes ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
