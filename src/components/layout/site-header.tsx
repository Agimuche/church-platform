import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth/auth";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/sermons", label: "Sermons" },
  { href: "/videos", label: "Videos" },
  { href: "/live", label: "Live Broadcast" },
  { href: "/store", label: "TBC Store" },
  { href: "/give", label: "Give" },
  { href: "/events", label: "Events" },
  { href: "/prayer", label: "Prayer" },
  { href: "/counseling", label: "Counseling" },
  { href: "/contact", label: "Contact" },
];

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur-md shadow-xs transition-colors">
      {/* Top micro-announcement / service times bar */}
      <div className="hidden bg-slate-900 px-4 py-1.5 text-xs text-slate-300 sm:block dark:bg-slate-950/90 dark:border-b dark:border-slate-800/60">
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sundays: <strong>Phronesis</strong> 8:00 AM &bull; <strong>Doxa</strong> 9:15 AM</span>
            </span>
            <span className="text-slate-500">|</span>
            <span>Tuesdays: <strong>Accelerate</strong> 6:00 AM &bull; Wednesdays: <strong>Wordshop</strong> 6:00 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://web.facebook.com/thebrookchurchng/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition"
            >
              Facebook Live
            </a>
            <a
              href="https://www.youtube.com/@thebrookchurchng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-red-400 transition"
            >
              <svg className="w-3 h-3 fill-current text-red-500" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
            <a
              href="tel:+2348023315468"
              className="text-slate-300 hover:text-white transition"
            >
              +234 802 331 5468
            </a>
          </div>
        </div>
      </div>

      <div className="container-app flex h-18 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-sky-400/20 shadow-md transition group-hover:scale-105">
            <Image
              src="/logo.jpg"
              alt="The Brook Church Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-ink group-hover:text-accent transition">
              The Brook Church
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-muted">
              Calabar &bull; Nigeria
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 text-sm font-medium text-ink-muted xl:flex">
          {NAV_LINKS.slice(0, 7).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-accent ${
                link.href === "/give" ? "font-semibold text-accent" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 text-ink-muted hover:text-accent transition">
              <span>More</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:flex flex-col w-48 rounded-xl border border-border bg-paper p-2 shadow-xl z-50">
              {NAV_LINKS.slice(7).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-tint hover:text-accent transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right CTAs (Desktop) */}
        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />

          <Link
            href="/live"
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Live
          </Link>
          <Link
            href="/give"
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
          >
            Give Online
          </Link>

          {user ? (
            <>
              {user.role && ADMIN_ROLES.has(user.role) && (
                <Link
                  href="/admin"
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-ink transition hover:border-accent hover:text-accent"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-accent-dark"
              >
                My Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-ink-muted hover:text-accent transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-accent-dark"
              >
                Join Us
              </Link>
            </>
          )}
        </div>

        {/* Mobile / Tablet Quick CTA & Drawer Toggle */}
        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <Link
            href="/live"
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Live
          </Link>
          <MobileNav links={NAV_LINKS} isSignedIn={Boolean(user)} />
        </div>
      </div>
    </header>
  );
}
