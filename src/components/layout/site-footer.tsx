import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Top Banner: Join in Person or Online */}
      <div className="border-b border-slate-800 bg-slate-950 py-8">
        <div className="container-app flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase text-sky-400">
              An Unfolding Story of God&apos;s Grace
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Join us this week at The Brook Church, Calabar
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/live"
              className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700 flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Watch Live Stream
            </Link>
            <Link
              href="/give"
              className="rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-sky-500"
            >
              Give Online
            </Link>
          </div>
        </div>
      </div>

      <div className="container-app grid gap-8 py-12 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {/* Church Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <Image src="/logo.jpg" alt="The Brook Church" fill className="object-cover" />
            </div>
            <span className="font-bold text-lg">The Brook Church</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Destiny determines the route you take in life. At The Brook Church, we celebrate the life-transforming power of God&apos;s Grace and the Ministry of the Holy Spirit.
          </p>
          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200">📍 Sanctuary Location:</p>
            <p>Asim Oko Street, Off Parliamentary Extension, Calabar, Cross River State, Nigeria.</p>
            <p className="pt-1 font-semibold text-slate-200">📞 Phone:</p>
            <p><a href="tel:+2348023315468" className="hover:text-sky-400 transition">+234 802 331 5468</a></p>
          </div>
        </div>


        {/* Weekly Services */}
        <div>
          <p className="font-semibold text-white tracking-wide uppercase text-xs">Weekly Services</p>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
            <li>
              <span className="block font-medium text-slate-200">Sunday 1st Service (Phronesis)</span>
              <span>8:00 AM</span>
            </li>
            <li>
              <span className="block font-medium text-slate-200">Sunday 2nd Service (Doxa)</span>
              <span>9:15 AM</span>
            </li>
            <li>
              <span className="block font-medium text-slate-200">Tuesday Prayer (Accelerate)</span>
              <span>6:00 AM</span>
            </li>
            <li>
              <span className="block font-medium text-slate-200">Wednesday Mid-week (Wordshop)</span>
              <span>6:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-semibold text-white tracking-wide uppercase text-xs">Quick Links</p>
          <ul className="mt-4 space-y-2 text-xs text-slate-400">
            <li><Link href="/about" className="hover:text-sky-400 transition">About Pastors &amp; History</Link></li>
            <li><Link href="/sermons" className="hover:text-sky-400 transition">Sermon Archive</Link></li>
            <li><Link href="/audio" className="hover:text-sky-400 transition">Audio Messages &amp; MP3</Link></li>
            <li><Link href="/store" className="hover:text-sky-400 transition">TBC Store (ELDAD Devotional)</Link></li>
            <li><Link href="/give" className="hover:text-sky-400 transition">Expansion Project &amp; Giving</Link></li>
            <li><Link href="/prayer" className="hover:text-sky-400 transition">Prayer Requests</Link></li>
            <li><Link href="/counseling" className="hover:text-sky-400 transition">Pastoral Counseling</Link></li>
          </ul>
        </div>

        {/* Connect & Social */}
        <div>
          <p className="font-semibold text-white tracking-wide uppercase text-xs">Connect With Us</p>
          <div className="mt-4 space-y-3 text-xs text-slate-400">
            <p>Follow us on our social platforms for live broadcasts, daily inspiration, and updates:</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://web.facebook.com/thebrookchurchng/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-400 transition"
              >
                <span>📘 Facebook:</span>
                <span className="text-slate-300">@thebrookchurchng</span>
              </a>
              <a
                href="https://twitter.com/tbcnigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-400 transition"
              >
                <span>🐦 X / Twitter:</span>
                <span className="text-slate-300">@tbcnigeria</span>
              </a>
              <a
                href="https://instagram.com/thebrookchurchng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-400 transition"
              >
                <span>📷 Instagram:</span>
                <span className="text-slate-300">@thebrookchurchng</span>
              </a>
              <a
                href="https://www.youtube.com/@thebrookchurchng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-red-400 transition"
              >
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 fill-current text-red-500" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube:
                </span>
                <span className="text-slate-300">@thebrookchurchng</span>
              </a>
            </div>
            <div className="pt-2">
              <Link
                href="/give"
                className="inline-block text-xs font-semibold text-emerald-400 hover:underline"
              >
                Partner with the Ministry →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} The Brook Church. All rights reserved. &bull; Calabar, Cross River State, Nigeria.</p>
      </div>
    </footer>
  );
}
