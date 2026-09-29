"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Upload,
  Video,
  Headphones,
  Edit2,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";

interface Speaker {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Sermon {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: string;
  speakerId: string | null;
  categoryId: string | null;
  thumbnailUrl: string | null;
  fileUrl: string | null;
  durationSeconds: number | null;
  visibility: string;
  price: any;
  allowDownload: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: any;
  createdAt: any;
  speaker?: Speaker | null;
  category?: Category | null;
}

export function SermonAdminManager({
  initialSermons,
  speakers,
  categories,
}: {
  initialSermons: Sermon[];
  speakers: Speaker[];
  categories: Category[];
}) {
  const [sermons, setSermons] = useState<Sermon[]>(initialSermons);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "SERMON_VIDEO",
    speakerId: speakers[0]?.id || "",
    categoryId: categories[0]?.id || "",
    thumbnailUrl: "",
    fileUrl: "",
    durationSeconds: "3600",
    visibility: "PUBLIC",
    allowDownload: true,
    isPublished: true,
    isFeatured: false,
    price: "",
  });

  const openCreateModal = () => {
    setEditingSermon(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      type: "SERMON_VIDEO",
      speakerId: speakers[0]?.id || "",
      categoryId: categories[0]?.id || "",
      thumbnailUrl: "",
      fileUrl: "",
      durationSeconds: "3600",
      visibility: "PUBLIC",
      allowDownload: true,
      isPublished: true,
      isFeatured: false,
      price: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title,
      slug: sermon.slug,
      description: sermon.description || "",
      type: sermon.type,
      speakerId: sermon.speakerId || speakers[0]?.id || "",
      categoryId: sermon.categoryId || categories[0]?.id || "",
      thumbnailUrl: sermon.thumbnailUrl || "",
      fileUrl: sermon.fileUrl || "",
      durationSeconds: sermon.durationSeconds ? sermon.durationSeconds.toString() : "",
      visibility: sermon.visibility,
      allowDownload: sermon.allowDownload,
      isPublished: sermon.isPublished,
      isFeatured: sermon.isFeatured,
      price: sermon.price ? sermon.price.toString() : "",
    });
    setIsModalOpen(true);
  };

  // Upload file directly to /api/admin/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "fileUrl" | "thumbnailUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      const finalUrl = json.publicUrl || json.url;
      setFormData((prev) => ({ ...prev, [targetField]: finalUrl }));
      setUploadProgress(`Uploaded: ${file.name}`);
      setTimeout(() => setUploadProgress(null), 3000);
    } catch (err: any) {
      alert(err.message || "Upload error");
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    try {
      if (editingSermon) {
        // Update
        const res = await fetch(`/api/admin/sermons/${editingSermon.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update sermon");

        setSermons((prev) => prev.map((s) => (s.id === editingSermon.id ? json.item : s)));
        setStatusMsg({ type: "success", text: "Sermon updated successfully!" });
      } else {
        // Create
        const res = await fetch("/api/admin/sermons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create sermon");

        setSermons((prev) => [json.item, ...prev]);
        setStatusMsg({ type: "success", text: "New sermon published successfully!" });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Save failed" });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/sermons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSermons((prev) => prev.filter((s) => s.id !== id));
      setStatusMsg({ type: "success", text: "Sermon deleted." });
    } catch {
      alert("Failed to delete sermon.");
    }
  };

  const filtered = sermons.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === "ALL" || s.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Sermons &amp; Media Management</h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Upload video sermons, audio MP3s, study guides, and manage teaching archives.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Upload / New Sermon</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`mt-4 rounded-xl p-3 text-xs font-semibold ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-paper p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-ink-muted" />
          <input
            type="search"
            placeholder="Search by sermon title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-tint pl-10 pr-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted">Format:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl border border-border bg-surface-tint px-3 py-1.5 text-xs text-ink outline-none"
          >
            <option value="ALL">All Media</option>
            <option value="SERMON_VIDEO">Video Sermons</option>
            <option value="SERMON_AUDIO">Audio Messages (MP3)</option>
          </select>
          <span className="text-xs text-ink-muted font-mono">{filtered.length} items</span>
        </div>
      </div>

      {/* Sermons Table / Cards */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-paper shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-tint text-[11px] uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-4 py-3">Sermon Title &amp; Details</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Preacher / Speaker</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-muted">
                    No sermons found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-tint/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                          {s.type === "SERMON_AUDIO" ? (
                            <Headphones className="h-5 w-5" />
                          ) : (
                            <Video className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-ink line-clamp-1">{s.title}</p>
                          <p className="text-[11px] text-ink-muted font-mono">/{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-surface-tint px-2.5 py-0.5 text-[10px] font-bold text-ink-muted border border-border">
                        {s.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink">{s.speaker?.name ?? "Pastor Ose Imiemohon"}</td>
                    <td className="px-4 py-3 text-ink-muted">{s.category?.name ?? "Grace & Faith"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${s.isPublished ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        <span className="font-medium text-ink">
                          {s.isPublished ? "Published" : "Draft"}
                        </span>
                        {s.isFeatured && (
                          <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/sermons/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-tint hover:text-accent transition"
                          title="View on site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(s)}
                          className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-tint hover:text-accent transition"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.title)}
                          className="rounded-lg p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Sermon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-paper p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-ink">
                {editingSermon ? "Edit Sermon / Teaching" : "Upload New Sermon or Message"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-ink-muted hover:bg-surface-tint transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Sermon Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Walking in Pneumatological Power"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Preacher / Minister
                  </label>
                  <select
                    value={formData.speakerId}
                    onChange={(e) => setFormData({ ...formData, speakerId: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-3 py-2 text-xs text-ink outline-none"
                  >
                    {speakers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Category / Theme
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-3 py-2 text-xs text-ink outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Media Format
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-3 py-2 text-xs text-ink outline-none"
                  >
                    <option value="SERMON_VIDEO">Video Sermon (MP4 / YouTube / HLS)</option>
                    <option value="SERMON_AUDIO">Audio Sermon (MP3 / Podcast)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Duration (in Seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.durationSeconds}
                    onChange={(e) => setFormData({ ...formData, durationSeconds: e.target.value })}
                    placeholder="e.g. 5400 (90 mins)"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                  />
                </div>
              </div>

              {/* Direct Media File Upload or URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Media File (Audio MP3 or Video MP4 or Direct URL)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="Upload a file or enter URL (e.g. https://...)"
                    className="flex-1 rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer rounded-xl bg-accent/10 border border-accent/30 px-4 py-2 text-xs font-bold text-accent hover:bg-accent/20 transition">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="audio/*,video/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, "fileUrl")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Thumbnail Cover Image Upload or URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Cover Thumbnail Image
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="Upload image or enter Image URL"
                    className="flex-1 rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer rounded-xl bg-surface-tint border border-border px-4 py-2 text-xs font-bold text-ink hover:bg-paper transition">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "thumbnailUrl")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {uploadProgress && (
                <p className="text-xs font-semibold text-accent animate-pulse">
                  {uploadProgress}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Sermon Outline / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key scriptures, summary, and pneumatic insights..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                />
              </div>

              {/* Toggles */}
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <span>Published Online</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <span>Featured Hero</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={formData.allowDownload}
                    onChange={(e) => setFormData({ ...formData, allowDownload: e.target.checked })}
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <span>Allow Direct Download</span>
                </label>
              </div>

              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-ink hover:bg-surface-tint"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-full bg-accent px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : editingSermon ? "Update Sermon" : "Publish Sermon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
