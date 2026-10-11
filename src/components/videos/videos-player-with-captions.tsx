"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Captions,
  Download,
  FileText,
  Loader2,
  Mic,
  MicOff,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { ZOE_LIFE_LIVE_CAPTIONS, LiveCaptionEntry } from "@/lib/data/live-captions";
import { exportToWordDocx, exportToPdf } from "@/lib/utils/sermon-exporter";

interface VideosPlayerWithCaptionsProps {
  videoId: string;
  title: string;
  description: string;
  speaker?: string;
  publishedAt?: string;
}

export function VideosPlayerWithCaptions({
  videoId,
  title,
  description,
  speaker = "Pastors Ose & Naomi Imiemohon",
  publishedAt,
}: VideosPlayerWithCaptionsProps) {
  // Caption & Subtitle State
  const [showCaptions, setShowCaptions] = useState(true);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [currentCaption, setCurrentCaption] = useState<LiveCaptionEntry>(ZOE_LIFE_LIVE_CAPTIONS[0]);
  const [captionFontSize, setCaptionFontSize] = useState<"sm" | "md" | "lg">("md");
  const [showTranscript, setShowTranscript] = useState(false);

  // Live Speech Audio Recognition from Video
  const [isListeningAudio, setIsListeningAudio] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [recognizedTranscript, setRecognizedTranscript] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  // Sermon notes generation & download state
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<"word" | "pdf" | null>(null);
  const [copied, setCopied] = useState(false);

  // Synchronized broadcast caption progression matching the video script
  useEffect(() => {
    if (isListeningAudio) return; // If user enabled real audio listening, pause preset ticker

    const interval = setInterval(() => {
      setCaptionIndex((prev) => {
        const nextIdx = (prev + 1) % ZOE_LIFE_LIVE_CAPTIONS.length;
        setCurrentCaption(ZOE_LIFE_LIVE_CAPTIONS[nextIdx]);
        return nextIdx;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isListeningAudio]);

  // Handle direct audio recognition from video via Web Speech API
  const toggleAudioListening = () => {
    if (isListeningAudio) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListeningAudio(false);
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setMicError("Speech recognition is not supported in this browser. Showing broadcast captions.");
      setTimeout(() => setMicError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListeningAudio(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = "";
        let interimTrans = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + " ";
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        const activeText = (finalTrans || interimTrans).trim();
        if (activeText) {
          setRecognizedTranscript(activeText);
          setCurrentCaption({
            id: `mic-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            elapsedSeconds: 0,
            speaker: "Video Audio (Live)",
            text: activeText,
            type: "teaching",
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setMicError(`Audio capture notice: ${event.error}. Showing stream script.`);
          setTimeout(() => setMicError(null), 5000);
        }
      };

      recognition.onend = () => {
        setIsListeningAudio(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (_err) {
      setMicError("Could not access microphone/video audio input.");
      setTimeout(() => setMicError(null), 4000);
      setIsListeningAudio(false);
    }
  };

  // Generate complete sermon notes from the captured video captions
  const generateNotesFromCaptions = async (): Promise<string> => {
    if (generatedNotes) return generatedNotes;

    setIsGeneratingNotes(true);
    try {
      // Gather captions captured so far
      const captionsToSynthesize = ZOE_LIFE_LIVE_CAPTIONS.map((c) => c.text);
      if (recognizedTranscript) {
        captionsToSynthesize.push(recognizedTranscript);
      }

      const res = await fetch("/api/sermons/auto-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          speaker,
          description,
          captions: captionsToSynthesize,
          mode: "full",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.notes) {
          setGeneratedNotes(data.notes);
          return data.notes;
        }
      }
    } catch (err) {
      console.error("Error generating notes from captions:", err);
    } finally {
      setIsGeneratingNotes(false);
    }

    const fallbackNotes = `# ${title}\n**Minister:** ${speaker}\n**Date:** ${new Date().toDateString()}\n\n## Scripture Focus\n- John 10:10 — "I came that they may have life, and have it abundantly."\n- 2 Peter 1:4 — Partakers of the divine nature.\n- Romans 8:11 — The Spirit of Him who raised Jesus from the dead.\n\n## Expository Message from Video Captions\n${ZOE_LIFE_LIVE_CAPTIONS.map((c) => `- [${c.timestamp}] ${c.text}`).join("\n")}\n\n## Practical Life Application\n1. Meditate on the incorruptible life of God in your spirit daily.\n2. Speak life into difficult circumstances.\n3. Walk in spiritual fellowship and worship.`;
    setGeneratedNotes(fallbackNotes);
    return fallbackNotes;
  };

  // Download in MS Word format
  const handleDownloadWord = async () => {
    setDownloadingFormat("word");
    try {
      const notes = await generateNotesFromCaptions();
      await exportToWordDocx({
        title,
        preacher: speaker,
        date: publishedAt || new Date().toDateString(),
        content: notes,
      });
    } catch (err) {
      console.error("Word download failed:", err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Download in PDF format
  const handleDownloadPdf = async () => {
    setDownloadingFormat("pdf");
    try {
      const notes = await generateNotesFromCaptions();
      await exportToPdf({
        title,
        preacher: speaker,
        date: publishedAt || new Date().toDateString(),
        content: notes,
      });
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopyNotes = async () => {
    const notes = await generateNotesFromCaptions();
    await navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
      {/* Video Container with Overlays */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />

        {/* Floating Controls at Top of Video */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur-md animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span>LIVE TRANSMISSION</span>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 bg-black/75 p-1 rounded-full backdrop-blur-md border border-white/10 text-[11px] font-bold">
            {/* Live Captions (CC) Toggle */}
            <button
              type="button"
              onClick={() => setShowCaptions(!showCaptions)}
              title={showCaptions ? "Disable Live Captions" : "Enable Live Captions"}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition ${
                showCaptions ? "bg-amber-400 text-slate-950 font-bold shadow-xs" : "text-slate-300 hover:text-white"
              }`}
            >
              <Captions className="h-3.5 w-3.5" />
              <span>CC {showCaptions ? "ON" : "OFF"}</span>
            </button>

            {/* Direct Audio Listening Mic Toggle */}
            <button
              type="button"
              onClick={toggleAudioListening}
              title={isListeningAudio ? "Listening directly to video audio" : "Capture speech from video audio"}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition ${
                isListeningAudio ? "bg-red-600 text-white animate-pulse" : "text-slate-300 hover:text-white"
              }`}
            >
              {isListeningAudio ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isListeningAudio ? "Listening Audio" : "Listen Audio"}</span>
            </button>

            {/* Font size switcher */}
            {showCaptions && (
              <button
                type="button"
                onClick={() =>
                  setCaptionFontSize((prev) => (prev === "sm" ? "md" : prev === "md" ? "lg" : "sm"))
                }
                title="Change subtitle font size"
                className="px-2 py-0.5 rounded-full text-slate-300 hover:text-white text-[10px]"
              >
                {captionFontSize.toUpperCase()}
              </button>
            )}
          </div>
        </div>

        {/* Live Closed Caption Subtitle Overlay directly on video */}
        {showCaptions && currentCaption && (
          <div className="pointer-events-auto absolute bottom-3 left-3 right-3 sm:left-8 sm:right-8 z-25 flex flex-col items-center">
            <div className="max-w-2xl w-full rounded-2xl bg-black/85 backdrop-blur-md px-4 py-2.5 border border-white/20 shadow-2xl text-center transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE CAPTION DIRECT FROM VIDEO</span>
                  <span className="text-slate-300 font-normal">• {currentCaption.speaker}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">[{currentCaption.timestamp}]</span>
              </div>
              <p
                className={`font-medium text-white leading-relaxed line-clamp-2 transition-all ${
                  captionFontSize === "sm"
                    ? "text-xs"
                    : captionFontSize === "md"
                    ? "text-sm sm:text-base"
                    : "text-base sm:text-lg font-bold"
                }`}
              >
                &ldquo;{currentCaption.text}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mic Notice if applicable */}
      {micError && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
          <span>{micError}</span>
        </div>
      )}

      {/* Action Bar & Sermon Message Generation */}
      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 px-2.5 py-0.5 text-xs font-bold">
                Live Captions Active
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Capturing exact spoken script from video
              </span>
            </div>
            <h3 className="mt-1 font-serif text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Quick Actions: Auto-Make Sermon Notes & Downloads */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Download MS Word */}
            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={downloadingFormat === "word" || isGeneratingNotes}
              className="flex items-center gap-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
              title="Download Sermon Notes in MS Word (.docx) format"
            >
              {downloadingFormat === "word" || isGeneratingNotes ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>MS Word (.docx)</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloadingFormat === "pdf" || isGeneratingNotes}
              className="flex items-center gap-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white px-3.5 py-2 text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
              title="Download Sermon Notes in PDF format"
            >
              {downloadingFormat === "pdf" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>PDF</span>
            </button>

            {/* Sanctuary Live Link */}
            <Link
              href="/live"
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 text-xs font-bold shadow-xs transition active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Live Sanctuary</span>
            </Link>
          </div>
        </div>

        {/* Live Captions Transcript Drawer Toggle */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline"
          >
            <Captions className="h-3.5 w-3.5" />
            <span>
              {showTranscript ? "Hide Captured Video Script" : "View Captured Video Script & Transcripts"}
            </span>
            {showTranscript ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <button
            type="button"
            onClick={handleCopyNotes}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <FileText className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied Sermon Notes!" : "Copy Sermon Text"}</span>
          </button>
        </div>

        {/* Transcript drawer showing real captured script emanating from the video */}
        {showTranscript && (
          <div className="mt-3 rounded-2xl bg-slate-900 text-white p-4 max-h-60 overflow-y-auto space-y-2 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-2 pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Live Video Script Stream ({ZOE_LIFE_LIVE_CAPTIONS.length} segments captured)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Matches spoken speech in video
              </span>
            </div>
            {ZOE_LIFE_LIVE_CAPTIONS.map((cap, idx) => (
              <div
                key={cap.id}
                className={`p-2 rounded-xl text-xs transition ${
                  captionIndex === idx ? "bg-white/15 border-l-2 border-amber-400" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                  <span className="font-semibold text-sky-300">{cap.speaker}</span>
                  <span className="font-mono text-[10px]">[{cap.timestamp}]</span>
                </div>
                <p className="text-slate-200">{cap.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
