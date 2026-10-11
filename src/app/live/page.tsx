import { getCurrentLiveStream } from "@/lib/data/streams";
import { LiveStreamPlayer } from "@/components/live/live-stream-player";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Broadcast | The Brook Church",
  description:
    "Join The Brook Church live broadcast online. Watch Phronesis, Doxa, Accelerate, and Wordshop services streaming live from Calabar on Facebook Live & YouTube.",
};

const TBC_FACEBOOK_URL = "https://web.facebook.com/thebrookchurchng/live_videos/";
const TBC_YOUTUBE_URL = "https://www.youtube.com/@thebrookchurchng";

export default async function LivePage() {
  const current = await getCurrentLiveStream();

  return (
    <div className="bg-background py-8 sm:py-12 transition-colors">
      <div className="container-app">
        {/* Dual Live Stream Announcement Banner */}
        <div className="mb-6 rounded-2xl border border-border bg-paper p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-red-600 animate-pulse" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink">
                Simultaneous Sanctuary Transmission
              </p>
              <p className="text-xs text-ink-muted">
                Extracted &amp; streamed live on both <strong className="text-blue-600">Facebook Live</strong> and <strong className="text-red-600">YouTube Live</strong> from Calabar.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={TBC_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              <span>📘 Facebook Live</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={TBC_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              <span>🔴 YouTube Live</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Standalone Multi-Platform Live Stream Player Engine */}
        <div className="mb-10">
          <LiveStreamPlayer
            initialTitle={current?.title ?? "Sunday Phronesis & Doxa Service"}
            initialDescription={
              current?.description ??
              "The Way of the Spirit — Live worship, word, and revelation from The Brook Church Sanctuary, Calabar."
            }
            initialStatus={current ? "LIVE" : "LIVE"}
            customStreamUrl={current?.playbackUrl ?? undefined}
            provider={current?.provider ?? undefined}
          />
        </div>

        {/* Facebook & YouTube Live Stream Archives / Catch Up */}
        <section className="mt-14">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Catch Up</span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Recent Service Broadcasts</h2>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={TBC_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Facebook Videos</span>
                <span>↗</span>
              </a>
              <span className="text-slate-300">&bull;</span>
              <a
                href={TBC_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <span>YouTube Channel</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "h6XWU2GNa6E",
                title: "ZOE LIFE CONFERENCE DAY 2 | LIVE NOW",
                platform: "youtube",
                date: "Oct 2026",
                url: "https://www.youtube.com/watch?v=h6XWU2GNa6E",
                thumb: "https://i.ytimg.com/vi/h6XWU2GNa6E/hqdefault.jpg",
                badge: "🔴 Live Now",
              },
              {
                id: "fb-zoe-live",
                title: "The Zoe Dimension — Facebook Live Sanctuary Stream",
                platform: "facebook",
                date: "Oct 2026",
                url: "https://web.facebook.com/thebrookchurchng/live_videos/",
                thumb: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
                badge: "Facebook Live",
              },
              {
                id: "FIiP-wbDK5k",
                title: "ZOE LIFE CONFERENCE DAY 1 | LIVE NOW",
                platform: "youtube",
                date: "Oct 2026",
                url: "https://www.youtube.com/watch?v=FIiP-wbDK5k",
                thumb: "https://i.ytimg.com/vi/FIiP-wbDK5k/hqdefault.jpg",
                badge: "Zoe Conf Day 1",
              },
              {
                id: "Yb4l4xWGTaM",
                title: "WORDSHOP — Pneumatology Bible Study",
                platform: "youtube",
                date: "Sep 2026",
                url: "https://www.youtube.com/watch?v=Yb4l4xWGTaM",
                thumb: "https://i.ytimg.com/vi/Yb4l4xWGTaM/hqdefault.jpg",
                badge: "Wordshop",
              },
              {
                id: "M-20iRqFSX4",
                title: "DOXA — Sunday 2nd Service",
                platform: "youtube",
                date: "Sep 2026",
                url: "https://www.youtube.com/watch?v=M-20iRqFSX4",
                thumb: "https://i.ytimg.com/vi/M-20iRqFSX4/hqdefault.jpg",
                badge: "Doxa Service",
              },
              {
                id: "P3pmBIPG19c",
                title: "PHRONESIS — Sunday 1st Service",
                platform: "youtube",
                date: "Sep 2026",
                url: "https://www.youtube.com/watch?v=P3pmBIPG19c",
                thumb: "https://i.ytimg.com/vi/P3pmBIPG19c/hqdefault.jpg",
                badge: "Phronesis Service",
              },
            ].map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-border bg-paper shadow-xs tbc-card-hover"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumb}
                    alt={video.title}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md ${
                        video.platform === "facebook" ? "bg-blue-600" : "bg-red-600"
                      }`}
                    >
                      {video.badge}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl backdrop-blur-sm transition group-hover:scale-110 ${
                        video.platform === "facebook" ? "bg-blue-600/90" : "bg-red-600/90"
                      }`}
                    >
                      <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-ink text-sm line-clamp-1 group-hover:text-accent transition">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">{video.date}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Scheduled Services & Broadcast Information */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Scheduled */}
          <section className="rounded-3xl border border-border bg-paper p-6 sm:p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Sanctuary Schedule
            </span>
            <h2 className="mt-1 font-serif text-xl font-bold text-ink">
              Upcoming Live Services
            </h2>
            <div className="mt-6 space-y-3">
              {[
                { name: "Sunday 1st Service — PHRONESIS", time: "8:00 AM", category: "Sunday Wisdom" },
                { name: "Sunday 2nd Service — DOXA", time: "9:15 AM", category: "Glory & Worship" },
                { name: "Tuesday Prayer — ACCELERATE", time: "6:00 AM", category: "Morning Prophetic" },
                { name: "Wednesday Mid-week — WORDSHOP", time: "6:00 PM", category: "Bible Study" },
              ].map((service) => (
                <div
                  key={service.name}
                  className="flex justify-between items-center rounded-2xl border border-border bg-surface-tint p-4"
                >
                  <div>
                    <p className="font-bold text-ink text-sm">{service.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{service.category} &bull; The Brook Church</p>
                  </div>
                  <span className="rounded-full bg-accent/10 text-accent font-semibold text-xs px-3 py-1 border border-accent/20">
                    {service.time}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Past Broadcasts & Notes */}
          <section className="rounded-3xl border border-border bg-paper p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Media &amp; Doctrine
              </span>
              <h2 className="mt-1 font-serif text-xl font-bold text-ink">
                Pneumatology &amp; Grace Archives
              </h2>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                Missed a live service? Our library archives every sermon on Pneumatology, the Zoe life, and healing of the mind taught by Pastor Ose Imiemohon and associate pastors on both Facebook and YouTube.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3">
              <Link
                href="/sermons"
                className="rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-accent-dark transition"
              >
                Browse Sermon Archive →
              </Link>
              <Link
                href="/audio"
                className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-ink hover:bg-surface-tint transition"
              >
                Audio MP3 Teachings
              </Link>
              <Link
                href="/give"
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                Give Tithes Online
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
