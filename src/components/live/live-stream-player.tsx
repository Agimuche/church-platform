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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LiveStreamProps {
  initialTitle?: string;
  initialDescription?: string;
  initialStatus?: "LIVE" | "SCHEDULED" | "ENDED";
  customStreamUrl?: string;
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
}: LiveStreamProps) {
  const [streamSource, setStreamSource] = useState<"native" | "camera" | "youtube">("native");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);
  const [viewerCount, setViewerCount] = useState(248);
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("chat");

  // Camera Studio State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", name: "Pastor Victor Owoeye", message: "Welcome to today's glorious service! The Spirit of God is in this place.", time: "8:05 AM", isPastor: true },
    { id: "2", name: "Sister Emem (Calabar)", message: "Hallelujah! Connected from Calabar. Ready to receive the Word.", time: "8:07 AM" },
    { id: "3", name: "Brother Daniel (Lagos)", message: "Grace upon grace! Amen to the Word!", time: "8:12 AM" },
    { id: "4", name: "Sister Grace (United Kingdom)", message: "Watching live from London. The Zoe life is at work!", time: "8:15 AM" },
  ]);
  const [inputName, setInputName] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Notes state
  const [notes, setNotes] = useState("");

  // Reactions state
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const reactionCounter = useRef(0);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      setCameraError("Camera access denied or unavailable. You can use native cloud stream or YouTube.");
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

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left/Main Column: Stream Player & Broadcast Controls */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Stream Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-paper p-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              Broadcast Engine
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-tint border border-border text-xs font-medium">
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
              Direct Cloud Stream
            </button>
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
              Live Studio Cam
            </button>
            <button
              onClick={() => {
                stopCameraStudio();
                setStreamSource("youtube");
              }}
              className={`rounded-lg px-3 py-1.5 transition ${
                streamSource === "youtube"
                  ? "bg-red-600 text-white shadow-xs font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              YouTube Live
            </button>
          </div>
        </div>

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

          {/* Player Display based on stream source */}
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
                  poster="https://i.ytimg.com/vi/Ya3yIiRPqT0/maxresdefault.jpg"
                  className="h-full w-full object-cover"
                  src={customStreamUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                />
              )}
            </div>
          )}

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

          {streamSource === "youtube" && (
            <iframe
              src="https://www.youtube.com/embed/live_stream?channel=UCJvBuTWCGPOYzucq8QhPYwQ&autoplay=1&rel=0&modestbranding=1"
              title="The Brook Church — YouTube Live"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          )}

          {/* Watermark / Logo Overlay */}
          <div className="pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-slate-950/60 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md border border-white/10">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>TBC LIVE</span>
            <span className="text-white/40">|</span>
            <span className="text-sky-300 font-mono">{viewerCount} Watching</span>
          </div>

          {/* Interactive Player Controls Bar (For Native & Camera modes) */}
          {streamSource !== "youtube" && (
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
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  {initialStatus}
                </span>
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
        <div className="flex h-[600px] flex-col rounded-3xl border border-border bg-paper shadow-md overflow-hidden">
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
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "notes"
                    ? "bg-paper text-accent shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Sermon Notes
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

          {/* Tab 2: Sermon Notes Notepad */}
          {activeTab === "notes" && (
            <div className="flex flex-1 flex-col p-4">
              <p className="text-xs text-ink-muted mb-2">
                Type scripture references, key points and revelations from today&apos;s sermon.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="• Sermon Topic:&#10;• Scriptures:&#10;• Key Revelation:&#10;• Action Points:"
                className="flex-1 w-full rounded-2xl border border-border bg-surface-tint p-3 text-xs leading-relaxed text-ink outline-none transition focus:border-accent resize-none font-mono"
              />
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[10px] text-ink-muted">Saved locally in browser</span>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([notes], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `TBC-Sermon-Notes-${new Date().toISOString().slice(0, 10)}.txt`;
                    a.click();
                  }}
                  className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-dark transition"
                >
                  Download Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
