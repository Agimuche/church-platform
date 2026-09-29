"use client";

import React, { useState } from "react";
import { Plus, Megaphone, Pin, Edit2, Trash2, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  isPinned: boolean;
  publishAt: any;
  expiresAt: any;
}

export function AnnouncementAdminManager({
  initialAnnouncements,
}: {
  initialAnnouncements: Announcement[];
}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    imageUrl: "",
    isPinned: false,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: "", body: "", imageUrl: "", isPinned: false });
    setIsModalOpen(true);
  };

  const openEditModal = (a: Announcement) => {
    setEditingItem(a);
    setFormData({
      title: a.title,
      body: a.body,
      imageUrl: a.imageUrl || "",
      isPinned: a.isPinned,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/announcements/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Update failed");
        setAnnouncements((prev) => prev.map((a) => (a.id === editingItem.id ? json.item : a)));
      } else {
        const res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Creation failed");
        setAnnouncements((prev) => [json.item, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save announcement");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete announcement "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete announcement.");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Church Announcements</h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Publish notices, conferences, expansion milestones, and pinned church bulletins.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-border bg-paper p-8 text-center text-ink-muted">
            No announcements published yet.
          </div>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 rounded-2xl border bg-paper p-5 shadow-xs transition hover:shadow-md ${
                a.isPinned ? "border-amber-400/50 bg-amber-50/20 dark:bg-amber-950/10" : "border-border"
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  {a.isPinned && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                      <Pin className="h-3 w-3" /> Pinned
                    </span>
                  )}
                  <h3 className="font-bold text-ink text-base">{a.title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-ink-muted max-w-2xl">{a.body}</p>
                <p className="text-[11px] text-ink-muted">
                  Published {formatDate(a.publishAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(a)}
                  className="rounded-lg p-2 text-ink-muted hover:bg-surface-tint hover:text-accent transition"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(a.id, a.title)}
                  className="rounded-lg p-2 text-ink-muted hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-paper p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-ink">
                {editingItem ? "Edit Announcement" : "Create Announcement"}
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
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Capstone Thanksgiving Service"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Announcement Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Enter full notice or bulletin..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pinCheckbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="h-4 w-4 rounded accent-accent"
                />
                <label htmlFor="pinCheckbox" className="text-xs font-semibold text-ink cursor-pointer">
                  Pin to top of home page and notice board
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
                  className="rounded-full bg-accent px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition"
                >
                  {editingItem ? "Update Notice" : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
