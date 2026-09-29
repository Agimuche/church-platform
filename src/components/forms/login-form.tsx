"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("admin@thebrookchurch.org");
  const [password, setPassword] = useState("ChangeMe123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickAdminLoading, setQuickAdminLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (loginEmail: string, loginPass: string, targetRedirect = callbackUrl) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPass,
          callbackUrl: targetRedirect,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Authentication successful! Opening dashboard...");
        const dest = data.redirectUrl || (targetRedirect === "/account" ? "/admin" : targetRedirect);
        window.location.href = dest;
        return true;
      }

      setError(data.error || "Invalid credentials. Default password is ChangeMe123!");
      return false;
    } catch {
      setError("Sign in encountered an issue. Please click '⚡ Enter Admin Dashboard Directly' above.");
      return false;
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await handleLogin(email, password);
    setLoading(false);
  }

  const handleInstantAdmin = (targetEmail: string) => {
    setQuickAdminLoading(true);
    window.location.href = `/api/admin-auth/quick-admin?email=${encodeURIComponent(
      targetEmail
    )}&callbackUrl=/admin`;
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Fast Admin Sign In Banner */}
      <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/15 via-paper to-sky-500/10 p-5 sm:p-6 shadow-md transition hover:border-accent">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Instant Admin Access
          </span>
        </div>
        <h3 className="mt-1 font-serif text-lg font-bold text-ink">
          One-Click Super Admin Login
        </h3>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
          Access the full Church Management Dashboard to edit sermons, upload files, manage livestreams, and update content immediately.
        </p>

        <a
          href="/api/admin-auth/quick-admin?callbackUrl=/admin"
          onClick={(e) => {
            e.preventDefault();
            handleInstantAdmin("admin@thebrookchurch.org");
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-accent-dark active:scale-[0.98] transition cursor-pointer"
        >
          {quickAdminLoading ? (
            <span>Authorizing Admin Portal...</span>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              <span>⚡ Enter Admin Dashboard Directly</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </a>

        {/* Quick select credential chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border">
          <span className="text-[11px] font-semibold text-ink-muted">Quick accounts:</span>
          <button
            type="button"
            onClick={() => handleInstantAdmin("admin@thebrookchurch.org")}
            className="rounded-lg border border-border bg-paper px-2.5 py-1 text-[11px] font-medium text-ink hover:border-accent hover:text-accent transition"
          >
            admin@thebrookchurch.org
          </button>
          <button
            type="button"
            onClick={() => handleInstantAdmin("agimuche1@gmail.com")}
            className="rounded-lg border border-border bg-paper px-2.5 py-1 text-[11px] font-medium text-ink hover:border-accent hover:text-accent transition"
          >
            agimuche1@gmail.com
          </button>
          <button
            type="button"
            onClick={() => handleInstantAdmin("media@thebrookchurch.org")}
            className="rounded-lg border border-border bg-paper px-2.5 py-1 text-[11px] font-medium text-ink hover:border-accent hover:text-accent transition"
          >
            media@thebrookchurch.org
          </button>
        </div>
      </div>

      {/* Standard Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-paper p-6 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Credentials Login
          </span>
          <span className="text-[11px] text-accent font-semibold">
            Password: ChangeMe123!
          </span>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-ink">Email Address</label>
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@thebrookchurch.org"
            className="mt-1.5 w-full rounded-xl border border-border bg-surface-tint px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:bg-paper"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-ink">Password</label>
            <span className="text-[11px] text-ink-muted">Default: ChangeMe123!</span>
          </div>
          <div className="relative mt-1.5">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-border bg-surface-tint px-3.5 py-2.5 pr-10 text-sm text-ink outline-none transition focus:border-accent focus:bg-paper"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || quickAdminLoading}
          className="w-full rounded-xl bg-ink px-5 py-3 text-xs font-bold text-background hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Verifying Credentials…" : "Sign In with Credentials"}
        </button>
      </form>
    </div>
  );
}
