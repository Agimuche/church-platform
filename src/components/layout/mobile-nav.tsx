"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({
  links,
  isSignedIn,
}: {
  links: NavLink[];
  isSignedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close menu on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      {/* Menu Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle navigation menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xs transition hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Drawer Overlay & Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu Content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-paper">
              <span className="font-serif font-bold text-sm text-ink">
                The Brook Church
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-tint text-ink-muted hover:text-ink hover:bg-border transition"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Quick Action CTAs */}
            <div className="p-4 space-y-2 border-b border-border bg-surface-tint">
              <Link
                href="/live"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Live Broadcast
              </Link>
              <Link
                href="/give"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
              >
                Give Online
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1 bg-paper">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-accent/10 font-bold text-accent"
                        : "text-ink hover:bg-surface-tint"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Account / Sign-in */}
            <div className="border-t border-border p-4 bg-paper space-y-2.5">
              {isSignedIn ? (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-accent py-2.5 text-xs font-bold text-white shadow-xs hover:bg-accent-dark transition"
                >
                  My Account
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-border bg-paper py-2.5 font-semibold text-ink hover:bg-surface-tint transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-accent py-2.5 font-bold text-white shadow-xs hover:bg-accent-dark transition"
                  >
                    Join Us
                  </Link>
                </div>
              )}

              {/* Social Channels in Drawer */}
              <div className="pt-3 border-t border-border flex items-center justify-around text-xs text-ink-muted">
                <a
                  href="https://www.youtube.com/@thebrookchurchng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 font-medium transition"
                >
                  YouTube
                </a>
                <span>&bull;</span>
                <a
                  href="https://web.facebook.com/thebrookchurchng/live_videos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 font-medium transition"
                >
                  Facebook
                </a>
                <span>&bull;</span>
                <a
                  href="https://www.instagram.com/thebrookchurchng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 font-medium transition"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
