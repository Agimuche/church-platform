"use client";

import { useState } from "react";

const CATEGORIES = [
  "Marriage & Family",
  "Grief & Loss",
  "Personal Growth",
  "Financial Guidance",
  "Spiritual Direction",
  "Other",
];

export function CounselingRequestForm({ isSignedIn }: { isSignedIn: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      category: form.get("category"),
      description: form.get("description"),
      preferredDate: form.get("preferredDate") || undefined,
      guestName: form.get("guestName") || undefined,
      guestEmail: form.get("guestEmail") || undefined,
      guestPhone: form.get("guestPhone") || undefined,
    };

    try {
      const res = await fetch("/api/counseling-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-paper p-6 text-center">
        <p className="font-medium text-ink">Your request has been sent.</p>
        <p className="mt-1 text-sm text-ink-muted">A pastor will reach out to confirm a time.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-paper p-6">
      {!isSignedIn && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">Your name</label>
            <input name="guestName" required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Email</label>
            <input name="guestEmail" type="email" required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Phone (optional)</label>
            <input name="guestPhone" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-ink">Category</label>
        <select name="category" required defaultValue="" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm">
          <option value="" disabled>Choose a category…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Preferred date (optional)</label>
        <input name="preferredDate" type="date" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Tell us a little about what you&apos;d like to discuss</label>
        <textarea
          name="description"
          required
          minLength={10}
          rows={5}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <p className="text-xs text-ink-muted">
        This information is only visible to pastors and administrators handling your request.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Request Counseling"}
      </button>
    </form>
  );
}
