"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  File,
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Copy,
  Check,
  Trash2,
  Download,
  FolderOpen,
  RefreshCw,
} from "lucide-react";

interface UploadedFile {
  key: string;
  name: string;
  url: string;
  size: number;
  updatedAt: string;
}

export function FileManager() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/files")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) {
          setFiles(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i];
        const fd = new FormData();
        fd.append("file", f);
        await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
      }
      await fetchFiles();
    } catch (err: any) {
      alert("Failed to upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Permanently delete this file?`)) return;
    try {
      const res = await fetch("/api/admin/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.key !== key));
      }
    } catch {
      alert("Failed to delete file.");
    }
  };

  const copyUrl = (url: string, key: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext || "")) {
      return <ImageIcon className="h-6 w-6 text-sky-500" />;
    }
    if (["mp3", "wav", "m4a", "aac"].includes(ext || "")) {
      return <Music className="h-6 w-6 text-purple-500" />;
    }
    if (["mp4", "mov", "webm", "mkv"].includes(ext || "")) {
      return <Video className="h-6 w-6 text-red-500" />;
    }
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) {
      return <FileText className="h-6 w-6 text-amber-500" />;
    }
    return <File className="h-6 w-6 text-slate-400" />;
  };

  const filtered = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    if (filterType === "IMAGES") {
      return matchesSearch && ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
    }
    if (filterType === "AUDIO") {
      return matchesSearch && ["mp3", "wav", "m4a", "aac"].includes(ext);
    }
    if (filterType === "VIDEO") {
      return matchesSearch && ["mp4", "mov", "webm"].includes(ext);
    }
    if (filterType === "DOCS") {
      return matchesSearch && ["pdf", "doc", "docx", "txt", "zip"].includes(ext);
    }
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Media &amp; File Manager</h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Upload audio files (MP3), videos (MP4), documents (PDF), and images for the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={fetchFiles}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-paper px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-tint transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <label className="flex items-center gap-2 cursor-pointer rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition">
            <Upload className="h-4 w-4" />
            <span>{uploading ? "Uploading..." : "Upload New Files"}</span>
            <input
              type="file"
              multiple
              disabled={uploading}
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Drag & Drop Upload Hero Area */}
      <div className="mt-6 rounded-3xl border-2 border-dashed border-border bg-surface-tint/60 p-8 text-center transition hover:border-accent">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent mb-3">
          <FolderOpen className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-base font-bold text-ink">Upload any files to The Brook Church Cloud</h3>
        <p className="mt-1 text-xs text-ink-muted max-w-md mx-auto">
          Audio MP3 recordings, Sermon video MP4s, ELDAD Devotional PDFs, book covers, and worship slides.
        </p>
        <label className="mt-4 inline-flex items-center gap-2 cursor-pointer rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-accent-dark transition">
          <Upload className="h-3.5 w-3.5" />
          <span>Select Files From Computer</span>
          <input
            type="file"
            multiple
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Search and Filters */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-paper p-4 shadow-xs">
        <input
          type="search"
          placeholder="Filter files by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs rounded-xl border border-border bg-surface-tint px-3 py-1.5 text-xs text-ink outline-none transition focus:border-accent"
        />

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["ALL", "AUDIO", "VIDEO", "IMAGES", "DOCS"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                filterType === t
                  ? "bg-accent text-white font-semibold"
                  : "bg-surface-tint text-ink-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-border bg-paper p-12 text-center text-xs text-ink-muted">
            Loading storage files...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-paper p-12 text-center text-xs text-ink-muted">
            No uploaded files found. Use the upload button above to upload sermons, images, or PDFs!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((f) => (
              <div
                key={f.key}
                className="flex flex-col justify-between rounded-2xl border border-border bg-paper p-4 shadow-xs tbc-card-hover group"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-tint border border-border">
                      {getFileIcon(f.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink text-xs truncate" title={f.name}>
                        {f.name}
                      </p>
                      <p className="text-[11px] text-ink-muted font-mono mt-0.5">
                        {formatFileSize(f.size)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => copyUrl(f.url, f.key)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                  >
                    {copiedKey === f.key ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1 text-ink-muted hover:text-accent transition"
                      title="Open file"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(f.key)}
                      className="rounded-lg p-1 text-ink-muted hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
