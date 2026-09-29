import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "YouTube Videos | The Brook Church",
  description:
    "Watch video teachings, live service recordings, testimonies and highlights from The Brook Church Calabar on YouTube.",
};

// Real videos fetched from The Brook Church YouTube channel
// Channel: @thebrookchurchng | ID: UCJvBuTWCGPOYzucq8QhPYwQ
const YOUTUBE_CHANNEL_ID = "UCJvBuTWCGPOYzucq8QhPYwQ";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@thebrookchurchng";

// Videos from the RSS feed (most recent first) plus known videos
const YOUTUBE_VIDEOS = [
  {
    id: "Ya3yIiRPqT0",
    title: "DOXA — Sunday 2nd Service",
    description: "Experience the atmosphere of intense glory, worship and the manifested presence of God in this Doxa service.",
    publishedAt: "2026-09-27",
    category: "Sunday Service",
  },
  {
    id: "noxVVQgfU9E",
    title: "WORDSHOP — Mid-week Bible Study",
    description: "In-depth exposition and interactive teaching of the Scriptures. Grow in the Word.",
    publishedAt: "2026-09-24",
    category: "Midweek Service",
  },
  {
    id: "5HO7Ypny9m8",
    title: "WORDSHOP — Bible Study",
    description: "Deep dive into the Scriptures with Pastor Ose Imiemohon. Word and Doctrine.",
    publishedAt: "2026-09-17",
    category: "Midweek Service",
  },
  {
    id: "8ctbjSPbxAY",
    title: "The Brook Church — Service Broadcast",
    description: "Join The Brook Church as we minister the Word of Grace and the Holy Spirit.",
    publishedAt: "2026-09-14",
    category: "Service",
  },
  {
    id: "hKQuxczrrMg",
    title: "PHRONESIS — Sunday Morning Service",
    description: "Practical wisdom and spiritual understanding for daily living from The Brook Church.",
    publishedAt: "2026-09-07",
    category: "Sunday Service",
  },
  {
    id: "iMQjeyZ1_20",
    title: "ACCELERATE — Tuesday Morning Prayer",
    description: "Early morning prayer meeting to ignite supernatural speed and breakthroughs in your life.",
    publishedAt: "2026-09-02",
    category: "Prayer Meeting",
  },
  {
    id: "PqkTm5ClF1A",
    title: "The Brook Church — Praise & Worship",
    description: "An atmosphere of deep worship and encounter with the presence of God.",
    publishedAt: "2026-08-25",
    category: "Worship",
  },
];

function YouTubeCard({ video }: { video: typeof YOUTUBE_VIDEOS[0] }) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs tbc-card-hover">
      {/* Thumbnail */}
      <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-video overflow-hidden bg-slate-900">
        <Image
          src={thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition group-hover:scale-105"
          unoptimized
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-xl backdrop-blur-sm transition group-hover:scale-110">
            <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {/* Category badge */}
        <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          {video.category}
        </span>
      </a>

      {/* Content */}
      <div className="p-4">
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">
          <h3 className="font-serif font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-700 transition">
            {video.title}
          </h3>
        </a>
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {video.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">{video.publishedAt}</span>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app">
        {/* Hero Banner */}
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <svg className="w-3 h-3 fill-current text-red-400" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube Video Library
              </span>
              <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
                Watch The Brook Church
              </h1>
              <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
                Sermons, live services, Bible studies and special broadcasts. Subscribe to our YouTube channel for updates.
              </p>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-red-700 hover:scale-105 sm:self-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>

        {/* Latest Video Feature — Embed the most recent */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">Most Recent</span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">Latest Broadcast</h2>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-red-600 hover:text-red-800 transition"
            >
              View all on YouTube →
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEOS[0].id}?rel=0&modestbranding=1`}
                title={YOUTUBE_VIDEOS[0].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-slate-900">{YOUTUBE_VIDEOS[0].title}</h3>
            <p className="mt-1 text-sm text-slate-600">{YOUTUBE_VIDEOS[0].description}</p>
          </div>
        </section>

        {/* Video Grid */}
        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Video Archive</span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">Recent Broadcasts</h2>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {YOUTUBE_VIDEOS.slice(1).map((video) => (
              <YouTubeCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* CTA to YouTube */}
        <section className="mt-14 rounded-3xl bg-slate-900 p-8 text-white text-center shadow-xl sm:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Never Miss a Service
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Subscribe to our YouTube channel to get notified when we go live or upload new messages. Join thousands of believers growing in Grace.
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-red-700 hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe to @thebrookchurchng
            </a>
          </div>
        </section>

        {/* Live Stream CTA */}
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <span className="h-3 w-3 shrink-0 rounded-full bg-red-600 animate-pulse" />
              <div>
                <p className="font-bold text-slate-900">Watch Us Live</p>
                <p className="text-xs sm:text-sm text-slate-600">Join our Sunday services live — Phronesis (8 AM) &amp; Doxa (9:15 AM)</p>
              </div>
            </div>
            <Link
              href="/live"
              className="self-start sm:self-auto shrink-0 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
            >
              Go Live →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
