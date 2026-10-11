"use client";

import React, { useState } from "react";
import { Download, FileText, Loader2, Printer, Sparkles, Check } from "lucide-react";
import { exportToWordDocx, exportToPdf, printSermonNotes } from "@/lib/utils/sermon-exporter";

interface SermonNotesDownloadCardProps {
  title: string;
  speaker?: string;
  description?: string;
  date?: string;
}

export function SermonNotesDownloadCard({
  title,
  speaker = "The Brook Church",
  description = "",
  date,
}: SermonNotesDownloadCardProps) {
  const [loadingFormat, setLoadingFormat] = useState<"word" | "pdf" | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch or generate complete sermon notes text
  const getSermonText = async (): Promise<string> => {
    try {
      const res = await fetch("/api/sermons/auto-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          speaker,
          description,
          mode: "full",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.notes) return data.notes;
      }
    } catch {}

    return `THE BROOK CHURCH • CALABAR SANCTUARY\nSERMON MESSAGE NOTES\n\nTitle: ${title}\nMinister: ${speaker}\nDate: ${date || new Date().toDateString()}\n\nSummary:\n${description || "A powerful expository message on God's grace, Zoe life, and walking in spiritual authority."}`;
  };

  const handleDownloadWord = async () => {
    setLoadingFormat("word");
    try {
      const content = await getSermonText();
      await exportToWordDocx({
        title,
        preacher: speaker,
        date: date || new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content,
      });
    } catch (err) {
      console.error("Word download error:", err);
    } finally {
      setLoadingFormat(null);
    }
  };

  const handleDownloadPdf = async () => {
    setLoadingFormat("pdf");
    try {
      const content = await getSermonText();
      await exportToPdf({
        title,
        preacher: speaker,
        date: date || new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content,
      });
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setLoadingFormat(null);
    }
  };

  const handlePrint = async () => {
    const content = await getSermonText();
    printSermonNotes({
      title,
      preacher: speaker,
      date: date || new Date().toDateString(),
      content,
    });
  };

  const handleCopy = async () => {
    setIsGeneratingAi(true);
    try {
      const content = await getSermonText();
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-paper p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-serif text-sm font-bold text-ink">
            Sermon Message in Written Form
          </h3>
          <p className="text-[11px] text-ink-muted">
            Download complete sermon notes, scriptures, and teaching outline
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {/* Word Document */}
        <button
          type="button"
          onClick={handleDownloadWord}
          disabled={loadingFormat === "word"}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
        >
          {loadingFormat === "word" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span>MS Word (.docx)</span>
        </button>

        {/* PDF Document */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={loadingFormat === "pdf"}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
        >
          {loadingFormat === "pdf" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span>PDF (.pdf)</span>
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-ink-muted">
        <button
          type="button"
          onClick={handlePrint}
          className="hover:text-ink transition flex items-center gap-1"
        >
          <Printer className="h-3 w-3" />
          <span>Print Study Sheet</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          disabled={isGeneratingAi}
          className="hover:text-accent transition flex items-center gap-1"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Sparkles className="h-3 w-3 text-amber-500" />
          )}
          <span>{copied ? "Copied to Clipboard!" : "Copy Full Notes"}</span>
        </button>
      </div>
    </div>
  );
}
