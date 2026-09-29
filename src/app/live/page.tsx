import { getCurrentLiveStream, listUpcomingStreams, listStreamHistory } from "@/lib/data/streams";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Broadcast | The Brook Church",
  description:
    "Join The Brook Church live broadcast online. Watch Phronesis, Doxa, Accelerate, and Wordshop services streaming live from Calabar.",
};

// The Brook Church YouTube Channel ID for live streaming
const TBC_YOUTUBE_CHANNEL_ID = "UCJvBuTWCGPOYzucq8QhPYwQ";
const TBC_FACEBOOK_URL = "https://web.facebook.com/thebrookchurchng/";
const TBC_YOUTUBE_URL = "https://www.youtube.com/@thebrookchurchng";

export default async function LivePage() {
  const [current, upcoming, history] = await Promise.all([
    getCurrentLiveStream(),
    listUpcomingStreams(),
    listStreamHistory(6),
  ]);

  return (
    <div className="bg-slate-50 py-10 sm:py-14">
      <div className="container-app">
        {/* Stream Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {current ? (
              <Badge variant="live" className="shadow-xs">
                ● Live Broadcast
              </Badge>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Ready for Next Broadcast
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500">
              The Brook Church &mdash; Calabar
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href={TBC_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Watch on Facebook ↗
            </a>
            <a
              href={TBC_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube Live ↗
            </a>
            <Link
              href="/give"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              Give Offering
            </Link>
          </div>
        </div>

        {/* Live Stream Video Player */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
          {/* YouTube Live Embed — always shown; shows live when streaming */}
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/live_stream?channel=${TBC_YOUTUBE_CHANNEL_ID}&rel=0&modestbranding=1&autoplay=0`}
              title="The Brook Church — Live Broadcast"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Stream info strip */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          {current ? (
            <>
              <h1 className="font-serif text-2xl font-bold text-slate-900">{current.title}</h1>
              {current.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{current.description}</p>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-serif text-xl font-bold text-slate-900">
                  The Brook Church Live Broadcast
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  When we go live, the stream will appear above automatically. You can also watch on{" "}
                  <a href={TBC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">Facebook Live</a>{" "}
                  or{" "}
                  <a href={TBC_YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-600 hover:underline">YouTube</a>.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="text-xs font-semibold text-slate-500 uppercase">Offline</span>
              </div>
            </div>
          )}
        </div>

        {/* Latest YouTube Videos while offline */}
        {!current && (
          <section className="mt-10">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Catch Up</span>
              <h2 className="mt-1 font-serif text-xl font-bold text-slate-900">Watch Recent Services on YouTube</h2>
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
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs tbc-card-hover"
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
                  <div className="p-3">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-sky-700 transition">{video.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{video.date}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/videos"
                className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-800 transition"
              >
                Browse all videos →
              </Link>
            </div>
          </section>
        )}

        {/* Scheduled Services & Past Broadcasts */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* Scheduled */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Broadcast Schedule
            </span>
            <h2 className="mt-1 font-serif text-xl font-bold text-slate-900">
              Upcoming Live Services
            </h2>
            <div className="mt-6 space-y-3">
              {upcoming.length === 0 ? (
                <div className="space-y-3">
                  {[
                    { name: "Sunday 1st Service — PHRONESIS", time: "8:00 AM", color: "sky" },
                    { name: "Sunday 2nd Service — DOXA", time: "9:15 AM", color: "purple" },
                    { name: "Tuesday Prayer — ACCELERATE", time: "6:00 AM", color: "amber" },
                    { name: "Wednesday Mid-week — WORDSHOP", time: "6:00 PM", color: "emerald" },
                  ].map((service) => (
                    <div key={service.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-900">{service.name}</p>
                        <span className={`rounded-full bg-${service.color}-100 px-2.5 py-0.5 text-xs font-bold text-${service.color}-800`}>
                          {service.time}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Every week at The Brook Church, Calabar</p>
                    </div>
                  ))}
                </div>
              ) : (
                upcoming.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-bold text-slate-900">{s.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(s.scheduledStart)}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Past Broadcasts */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Catch Up
            </span>
            <h2 className="mt-1 font-serif text-xl font-bold text-slate-900">Recent Broadcasts</h2>
            <div className="mt-6 space-y-3">
              {history.length === 0 ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  <p>Check out our recorded messages on YouTube and in the sermons section.</p>
                  <div className="mt-4 flex flex-col gap-2 items-center">
                    <a
                      href={TBC_YOUTUBE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-red-600 hover:underline"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch on YouTube →
                    </a>
                    <Link href="/sermons" className="font-semibold text-sky-600 hover:underline">
                      Go to Sermon Archive →
                    </Link>
                    <Link href="/videos" className="font-semibold text-slate-600 hover:underline">
                      Browse Video Library →
                    </Link>
                  </div>
                </div>
              ) : (
                history.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-bold text-slate-900">{s.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {s.actualEnd ? formatDate(s.actualEnd) : ""}
                    </p>
                    {s.relatedSermon && (
                      <Link
                        href={`/sermons/${s.relatedSermon.slug}`}
                        className="mt-2 inline-block text-xs font-semibold text-sky-600 hover:underline"
                      >
                        Watch the recording →
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Give Offering CTA */}
        <section className="mt-10 rounded-2xl bg-emerald-50 border border-emerald-100 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Give Your Offering Online</h3>
            <p className="mt-1 text-sm text-slate-600">Support the ministry of The Brook Church and the Expansion Project.</p>
          </div>
          <Link
            href="/give"
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 self-start sm:self-center"
          >
            Give Now →
          </Link>
        </section>
      </div>
    </div>
  );
}
