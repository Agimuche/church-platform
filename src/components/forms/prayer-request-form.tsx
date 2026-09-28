"use client";

import { useState } from "react";

export function PrayerRequestForm({ isSignedIn }: { isSignedIn: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      message: form.get("message"),
      visibility: form.get("visibility"),
      guestName: form.get("guestName") || undefined,
      guestEmail: form.get("guestEmail") || undefined,
    };

    try {
      const res = await fetch("/api/prayer-requests", {
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
        <p className="font-medium text-ink">Thank you — we&apos;ve received your request.</p>
        <p className="mt-1 text-sm text-ink-muted">Our prayer team will be praying with you.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-paper p-6">
      {!isSignedIn && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">Your name (optional)</label>
            <input name="guestName" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Email, so we can follow up</label>
            <input
              name="guestEmail"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-ink">Your prayer request</label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Share as much or as little as you'd like…"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Visibility</label>
        <select name="visibility" defaultValue="PRIVATE" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm">
          <option value="PRIVATE">Private — only our prayer team sees this</option>
          <option value="PUBLIC">Public — share with the church family</option>
        </select>
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Submit Prayer Request"}
      </button>
    </form>
  );
}
