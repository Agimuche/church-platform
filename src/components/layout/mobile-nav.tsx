"use client";

import Link from "next/link";
import { useState } from "react";

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

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle navigation menu"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink"
      >
        <span className="sr-only">Menu</span>
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-border bg-paper px-5 py-4 shadow-lg">
          <nav className="flex flex-col gap-3 text-sm font-medium text-ink-muted">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3 border-t border-border pt-3">
              {isSignedIn ? (
                <Link href="/account" onClick={() => setOpen(false)} className="text-accent">
                  My Account
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="text-ink-muted">
                    Sign in
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="text-accent">
                    Join
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
