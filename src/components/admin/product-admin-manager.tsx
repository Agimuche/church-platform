"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Upload,
  BookOpen,
  Edit2,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  price: any;
  images: string[];
  categoryId: string | null;
  inventoryCount: number | null;
  digitalFileUrl: string | null;
  isPublished: boolean;
  createdAt: any;
  category?: Category | null;
}

export function ProductAdminManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "DIGITAL_BOOK",
    price: "1000",
    categoryId: categories[0]?.id || "",
    inventoryCount: "",
    imageUrl: "",
    digitalFileUrl: "",
    isPublished: true,
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      type: "DIGITAL_BOOK",
      price: "1000",
      categoryId: categories[0]?.id || "",
      inventoryCount: "",
      imageUrl: "",
      digitalFileUrl: "",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      type: p.type,
      price: p.price.toString(),
      categoryId: p.categoryId || categories[0]?.id || "",
      inventoryCount: p.inventoryCount !== null ? p.inventoryCount.toString() : "",
      imageUrl: p.images[0] || "",
      digitalFileUrl: p.digitalFileUrl || "",
      isPublished: p.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "imageUrl" | "digitalFileUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(`Uploading ${file.name}...`);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      const finalUrl = json.publicUrl || json.url;
      setFormData((prev) => ({ ...prev, [targetField]: finalUrl }));
      setUploadStatus(`Uploaded: ${file.name}`);
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || "Upload error");
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      ...formData,
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Update failed");

        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? json.item : p)));
        setFeedback({ type: "success", text: "Product updated successfully!" });
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Creation failed");

        setProducts((prev) => [json.item, ...prev]);
        setFeedback({ type: "success", text: "Product added to TBC Store!" });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Save failed" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedback({ type: "success", text: "Product deleted." });
    } catch {
      alert("Failed to delete product.");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">TBC Store &amp; Publications</h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Manage books, ELDAD devotionals, audio series MP3s, and digital downloads.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent-dark transition self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>New Product</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`mt-4 rounded-xl p-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Filter and Search */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-paper p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-ink-muted" />
          <input
            type="search"
            placeholder="Search products by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-tint pl-10 pr-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
          />
        </div>
        <span className="text-xs text-ink-muted font-mono">{filtered.length} products listed</span>
      </div>

      {/* Products Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-paper shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-tint text-[11px] uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-muted">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-tint/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-ink-muted font-mono">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{p.type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 font-semibold text-accent">{formatCurrency(p.price.toString())}</td>
                    <td className="px-4 py-3 text-ink-muted">{p.inventoryCount !== null ? p.inventoryCount : "Digital (Unlimited)"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${p.isPublished ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-slate-100 text-slate-700"}`}>
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/store/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-tint hover:text-accent transition"
                          title="View in store"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(p)}
                          className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-tint hover:text-accent transition"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-paper p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-ink">
                {editingProduct ? "Edit Product" : "Add Product to TBC Store"}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ELDAD Daily Devotional 2026 Edition"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Product Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-3 py-2 text-xs text-ink outline-none"
                  >
                    <option value="DIGITAL_BOOK">Digital E-Book (PDF/EPUB)</option>
                    <option value="DIGITAL_AUDIO">Digital Audio / MP3 Series</option>
                    <option value="PHYSICAL">Physical Hardcover / Softcover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Price (NGN) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Product Cover Image
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Upload cover image or enter URL"
                    className="flex-1 rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer rounded-xl bg-surface-tint border border-border px-4 py-2 text-xs font-bold text-ink hover:bg-paper transition">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "imageUrl")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Digital File Download Upload (PDF or ZIP) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Digital Asset File (PDF or Audio ZIP for buyers)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={formData.digitalFileUrl}
                    onChange={(e) => setFormData({ ...formData, digitalFileUrl: e.target.value })}
                    placeholder="Upload downloadable file or enter URL"
                    className="flex-1 rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer rounded-xl bg-accent/10 border border-accent/30 px-4 py-2 text-xs font-bold text-accent hover:bg-accent/20 transition">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Asset</span>
                    <input
                      type="file"
                      accept="application/pdf,application/zip,audio/*"
                      onChange={(e) => handleFileUpload(e, "digitalFileUrl")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {uploadStatus && (
                <p className="text-xs font-semibold text-accent animate-pulse">
                  {uploadStatus}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Description / Features
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of the publication..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-4 py-2 text-xs text-ink outline-none transition focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded accent-accent"
                />
                <label htmlFor="publishedCheckbox" className="text-xs font-semibold text-ink cursor-pointer">
                  Published and available for purchase in TBC Store
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
                  {isUploading ? "Uploading..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
