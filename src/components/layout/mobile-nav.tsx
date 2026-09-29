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

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <span className="font-bold text-sm text-slate-900">
                The Brook Church &bull; Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Quick Action CTAs */}
            <div className="p-4 space-y-2 border-b border-slate-100 bg-slate-50">
              <Link
                href="/live"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Live Broadcast
              </Link>
              <Link
                href="/give"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Give Offering Online
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-50 font-bold text-sky-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Account / Sign-in */}
            <div className="border-t border-slate-100 p-4 bg-slate-50">
              {isSignedIn ? (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-sky-600 bg-white py-2 text-xs font-bold text-sky-700 hover:bg-sky-50"
                >
                  My Account &amp; Profile
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-300 bg-white py-2 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-sky-600 py-2 font-bold text-white hover:bg-sky-700"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Social Channels in Drawer */}
              <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-around text-xs">
                <a
                  href="https://www.youtube.com/@thebrookchurchng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 font-semibold hover:underline"
                >
                  YouTube
                </a>
                <span className="text-slate-300">&bull;</span>
                <a
                  href="https://web.facebook.com/thebrookchurchng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Facebook
                </a>
                <span className="text-slate-300">&bull;</span>
                <a
                  href="https://www.instagram.com/thebrookchurchng/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-semibold hover:underline"
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
