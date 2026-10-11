import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth/auth";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const PRIMARY_NAV = [
  { href: "/", label: "Home" },
  { href: "/sermons", label: "Sermons" },
  { href: "/videos", label: "Videos" },
  { href: "/live", label: "Live Broadcast" },
  { href: "/store", label: "Store" },
  { href: "/give", label: "Give" },
];

const MORE_NAV = [
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/prayer", label: "Prayer Requests" },
  { href: "/counseling", label: "Pastoral Counseling" },
  { href: "/contact", label: "Contact Us" },
];

const NAV_LINKS = [...PRIMARY_NAV, ...MORE_NAV];

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-paper/90 backdrop-blur-md transition-colors">
      {/* Top announcement & quick contact bar */}
      <div className="hidden border-b border-slate-800/60 bg-slate-950 px-4 py-1.5 text-xs text-slate-300 md:block">
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sundays: <strong className="text-white">Phronesis</strong> 8:00 AM &bull; <strong className="text-white">Doxa</strong> 9:15 AM</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Wednesdays: <strong className="text-white">Wordshop</strong> 6:00 PM</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://web.facebook.com/thebrookchurchng/live_videos/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition hover:text-white"
            >
              Facebook Live
            </a>
            <a
              href="https://www.youtube.com/@thebrookchurchng"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 transition hover:text-red-400"
            >
              <svg className="h-3 w-3 fill-current text-red-500" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
            <a
              href="tel:+2348023315468"
              className="font-medium text-slate-300 transition hover:text-white"
            >
              +234 802 331 5468
            </a>
          </div>
        </div>
      </div>

      <div className="container-app flex h-16 items-center justify-between gap-4">
        {/* Clean, beautifully-spaced Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-sky-400/25 shadow-xs transition group-hover:scale-105">
            <Image
              src="/logo.jpg"
              alt="The Brook Church"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold leading-tight tracking-tight text-ink group-hover:text-accent transition">
              The Brook Church
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Calabar &bull; Nigeria
            </span>
          </div>
        </Link>

        {/* Clean, Uncrowded Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-[13px] font-medium text-ink-muted lg:flex">
          {PRIMARY_NAV.map((link) => (
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

          {/* Clean 'More' Dropdown with chevron */}
          <div className="group relative py-2">
            <button
              type="button"
              className="flex items-center gap-1 font-medium text-ink-muted transition hover:text-accent focus:outline-hidden"
            >
              <span>More</span>
              <svg className="h-3.5 w-3.5 transition group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full hidden w-52 flex-col rounded-2xl border border-border bg-paper p-2 shadow-xl backdrop-blur-md group-hover:flex z-50">
              {MORE_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-xs font-medium text-ink transition hover:bg-surface-tint hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right CTA Actions (Desktop) */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <ThemeToggle />

          <Link
            href="/live"
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span>Live</span>
          </Link>

          <Link
            href="/give"
            className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
          >
            Give Online
          </Link>

          {user ? (
            <>
              {user.role && ADMIN_ROLES.has(user.role) && (
                <Link
                  href="/admin"
                  className="rounded-full border border-accent/30 bg-accent/15 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-accent-dark"
              >
                Account
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile / Tablet View */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Link
            href="/live"
            className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span>Live</span>
          </Link>
          <MobileNav links={NAV_LINKS} isSignedIn={Boolean(user)} />
        </div>
      </div>
    </header>
  );
}
