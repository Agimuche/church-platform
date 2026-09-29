import { getCurrentLiveStream, listUpcomingStreams, listStreamHistory } from "@/lib/data/streams";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { LiveStreamPlayer } from "@/components/live/live-stream-player";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Broadcast | The Brook Church",
  description:
    "Join The Brook Church live broadcast online. Watch Phronesis, Doxa, Accelerate, and Wordshop services streaming live from Calabar.",
};

const TBC_FACEBOOK_URL = "https://web.facebook.com/thebrookchurchng/";
const TBC_YOUTUBE_URL = "https://www.youtube.com/@thebrookchurchng";

export default async function LivePage() {
  const [current, upcoming, history] = await Promise.all([
    getCurrentLiveStream(),
    listUpcomingStreams(),
    listStreamHistory(6),
  ]);

  return (
    <div className="bg-background py-8 sm:py-12 transition-colors">
      <div className="container-app">
        {/* Standalone Native Live Stream Player Engine */}
        <div className="mb-10">
          <LiveStreamPlayer
            initialTitle={current?.title ?? "Sunday Phronesis & Doxa Service"}
            initialDescription={current?.description ?? "The Way of the Spirit — Live worship, word, and revelation from The Brook Church Sanctuary, Calabar."}
            initialStatus={current ? "LIVE" : "LIVE"}
            customStreamUrl={current?.playbackUrl ?? undefined}
          />
        </div>

        {/* Latest YouTube Videos while offline or to catch up */}
        <section className="mt-14">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Catch Up</span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Recent Service Broadcasts</h2>
            </div>
            <a
              href={TBC_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1.5"
            >
              <span>Watch on YouTube Channel</span>
              <span>↗</span>
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "Ya3yIiRPqT0", title: "DOXA — Sunday 2nd Service", date: "Sep 27, 2026" },
              { id: "noxVVQgfU9E", title: "WORDSHOP — Bible Study", date: "Sep 24, 2026" },
              { id: "5HO7Ypny9m8", title: "WORDSHOP — Mid-week Bible Study", date: "Sep 17, 2026" },
            ].map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-border bg-paper shadow-xs tbc-card-hover"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl backdrop-blur-sm transition group-hover:scale-110">
                      <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-ink text-sm line-clamp-1 group-hover:text-accent transition">{video.title}</h3>
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
                <div key={service.name} className="flex justify-between items-center rounded-2xl border border-border bg-surface-tint p-4">
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
              <h2 className="mt-1 font-serif text-xl font-bold text-ink">Pneumatology &amp; Grace Archives</h2>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                Missed a live service? Our library archives every sermon on Pneumatology, the Zoe life, and healing of the mind taught by Pastor Ose Imiemohon and associate pastors.
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
