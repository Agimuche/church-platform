"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type PlatformType = "all" | "youtube" | "facebook" | "instagram";

export interface FeaturedMessage {
  id: string;
  title: string;
  subtitle: string;
  platform: "youtube" | "facebook" | "instagram";
  program: string;
  speaker: string;
  date: string;
  duration: string;
  url: string;
  youtubeId?: string;
  thumbnailUrl: string;
  summary: string;
  scripture?: string;
  viewsOrEngagement?: string;
}

export const FEATURED_MESSAGES_DATA: FeaturedMessage[] = [
  {
    id: "yt-doxa-sep27",
    title: "DOXA — Manifesting The Glory of God",
    subtitle: "Walking in Supernatural Grace & Unveiling the Zoe Life",
    platform: "youtube",
    program: "DOXA Service (Sundays 9:15 AM)",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 27, 2026",
    duration: "1h 48m",
    youtubeId: "Ya3yIiRPqT0",
    url: "https://www.youtube.com/watch?v=Ya3yIiRPqT0",
    thumbnailUrl: "https://i.ytimg.com/vi/Ya3yIiRPqT0/maxresdefault.jpg",
    summary:
      "A profound atmosphere of the Holy Spirit examining the manifest presence of God, divine Zoe life, and supernatural alignment in our daily walk.",
    scripture: "2 Corinthians 3:18 · John 10:10",
    viewsOrEngagement: "2.4K views",
  },
  {
    id: "yt-wordshop-sep24",
    title: "WORDSHOP — Pneumatology: Walking in the Spirit",
    subtitle: "The Ministry of the Holy Spirit & Inner Spiritual Discernment",
    platform: "youtube",
    program: "WORDSHOP (Wednesdays 6:00 PM)",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 24, 2026",
    duration: "1h 32m",
    youtubeId: "noxVVQgfU9E",
    url: "https://www.youtube.com/watch?v=noxVVQgfU9E",
    thumbnailUrl: "https://i.ytimg.com/vi/noxVVQgfU9E/maxresdefault.jpg",
    summary:
      "Deep doctrinal exposition on the person, power, and communion of the Holy Spirit. How to perceive divine direction and walk in spiritual authority.",
    scripture: "1 Corinthians 2:9-14 · Romans 8:14",
    viewsOrEngagement: "1.8K views",
  },
  {
    id: "fb-zoe-live",
    title: "The Zoe Dimension — Living Above the Elements",
    subtitle: "Sunday Global Live Stream from Calabar Sanctuary",
    platform: "facebook",
    program: "Sunday Service Live",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 27, 2026",
    duration: "1h 50m",
    url: "https://web.facebook.com/thebrookchurchng/live_videos/",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Streamed live from Calabar to thousands across the globe. Understanding the Zoe principle — how the incorruptible life of God works within the believer.",
    scripture: "1 John 5:11-12 · Romans 8:2",
    viewsOrEngagement: "4.2K watches & comments",
  },
  {
    id: "ig-grace-empowerment",
    title: "Grace is Empowerment, Not an Excuse!",
    subtitle: "The Brook Church Word Bites & Revelatory Reels",
    platform: "instagram",
    program: "Word Bites & Reel Highlights",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 26, 2026",
    duration: "2m 45s",
    url: "https://www.instagram.com/thebrookchurchng/",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A punchy, revelatory bite: Grace does not diminish righteousness; it empowers the believer to reign in life through Christ Jesus effortlessly.",
    scripture: "Titus 2:11-12 · Romans 5:17",
    viewsOrEngagement: "5.6K plays & shares",
  },
  {
    id: "yt-phronesis-wisdom",
    title: "PHRONESIS — Wisdom for Distinction & Impact",
    subtitle: "Eliminating Wasted Seasons Through Divine Prudence",
    platform: "youtube",
    program: "PHRONESIS Service (Sundays 8:00 AM)",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 20, 2026",
    duration: "1h 25m",
    youtubeId: "hKQuxczrrMg",
    url: "https://www.youtube.com/watch?v=hKQuxczrrMg",
    thumbnailUrl: "https://i.ytimg.com/vi/hKQuxczrrMg/maxresdefault.jpg",
    summary:
      "Exploring divine wisdom (Phronesis) that shifts your decision-making framework, unlocks creative insight, and commands prominence.",
    scripture: "Luke 1:17 · Ephesians 1:8",
    viewsOrEngagement: "2.1K views",
  },
  {
    id: "fb-accelerate-prayer",
    title: "ACCELERATE — Prophetic Decrees for Supernatural Speed",
    subtitle: "Tuesday Early Morning Prophetic Communion",
    platform: "facebook",
    program: "ACCELERATE (Tuesdays 6:00 AM)",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 22, 2026",
    duration: "45m",
    url: "https://web.facebook.com/thebrookchurchng/videos/",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Early morning prophetic broadcast on Facebook Live. Breaking barriers of stagnation, releasing supernatural momentum, and decreeing open doors.",
    scripture: "1 Kings 18:46 · Habakkuk 3:19",
    viewsOrEngagement: "3.1K reactions",
  },
  {
    id: "ig-marketplace-phronesis",
    title: "When Phronesis Meets Opportunity",
    subtitle: "Divine Strategy for Career & Industry Leadership",
    platform: "instagram",
    program: "Sunday Service Excerpt",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 23, 2026",
    duration: "3m 20s",
    url: "https://www.instagram.com/thebrookchurchng/",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Key excerpt: When divine practical wisdom guides your professional enterprise, favor becomes your identity and excellence your signature.",
    scripture: "Proverbs 8:12-16 · Daniel 1:20",
    viewsOrEngagement: "4.8K plays",
  },
  {
    id: "fb-nurturers-gathering",
    title: "The Nurturers — Called to Flourish & Establish Legacy",
    subtitle: "Special Family & Women's Ministry Broadcast",
    platform: "facebook",
    program: "Nurturers Special Broadcast",
    speaker: "Pastor Naomi Imiemohon",
    date: "Sep 14, 2026",
    duration: "1h 15m",
    url: "https://web.facebook.com/thebrookchurchng/",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Pastor Naomi ministers on flourishing under God's grace, raising godly heritage, spiritual parenting, and mental and emotional wellness.",
    scripture: "Psalm 92:13-14 · Proverbs 31:25",
    viewsOrEngagement: "2.9K watches",
  },
  {
    id: "yt-wordshop-authority",
    title: "WORDSHOP — The Believer's Spiritual Authority",
    subtitle: "Dominion in Christ & Prevailing over Spiritual Contradictions",
    platform: "youtube",
    program: "WORDSHOP (Wednesdays 6:00 PM)",
    speaker: "Pastor Ose Imiemohon",
    date: "Sep 17, 2026",
    duration: "1h 28m",
    youtubeId: "5HO7Ypny9m8",
    url: "https://www.youtube.com/watch?v=5HO7Ypny9m8",
    thumbnailUrl: "https://i.ytimg.com/vi/5HO7Ypny9m8/maxresdefault.jpg",
    summary:
      "Understanding your legal and vital seat in heavenly places, speaking with authority, and demonstrating the kingdom of God.",
    scripture: "Luke 10:19 · Ephesians 2:6",
    viewsOrEngagement: "1.9K views",
  },
  {
    id: "ig-worship-atmosphere",
    title: "Atmosphere of Zoe — Moments of Deep Prophetic Worship",
    subtitle: "The Levites & Congregation in High Praise",
    platform: "instagram",
    program: "Live Sanctuary Worship",
    speaker: "The Brook Church Levites",
    date: "Sep 19, 2026",
    duration: "4m 10s",
    url: "https://www.instagram.com/thebrookchurchng/",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
    summary:
      "An unscripted moment where the tangible presence of God swept through the sanctuary during high worship and spiritual alignment.",
    scripture: "Psalm 100:4 · John 4:23-24",
    viewsOrEngagement: "6.2K plays",
  },
];

export function FeaturedMessagesSection() {
  const [activePlatform, setActivePlatform] = useState<PlatformType>("all");
  const [modalVideoId, setModalVideoId] = useState<string | null>(null);

  const filteredMessages =
    activePlatform === "all"
      ? FEATURED_MESSAGES_DATA
      : FEATURED_MESSAGES_DATA.filter((m) => m.platform === activePlatform);

  const heroMessage = filteredMessages[0] ?? FEATURED_MESSAGES_DATA[0];
  const gridMessages = filteredMessages.slice(1);

  return (
    <section className="container-app" id="featured-messages">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600 animate-pulse" />
              Multi-Channel Broadcasts
            </span>
            <span className="text-xs font-medium text-slate-500">
              YouTube &bull; Facebook &bull; Instagram
            </span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Featured Messages
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Watch and listen to life-transforming messages and revelatory teachings from Pastor Ose &amp; Pastor Naomi Imiemohon across all our official streaming channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/videos"
            className="text-sm font-semibold text-sky-600 hover:text-sky-800 transition"
          >
            Video Archive →
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            href="/sermons"
            className="text-sm font-semibold text-sky-600 hover:text-sky-800 transition"
          >
            All Sermons →
          </Link>
        </div>
      </div>

      {/* Channel Channels Bar & Filter Tabs */}
      <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Filter buttons with touch-friendly responsive scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 no-scrollbar flex-nowrap sm:flex-wrap">
          <button
            type="button"
            onClick={() => setActivePlatform("all")}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition shrink-0 ${
              activePlatform === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Messages ({FEATURED_MESSAGES_DATA.length})
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform("youtube")}
            className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activePlatform === "youtube"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube Channel
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform("facebook")}
            className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activePlatform === "facebook"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook Live
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform("instagram")}
            className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activePlatform === "instagram"
                ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-xs"
                : "bg-pink-50 text-pink-700 hover:bg-pink-100"
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram Reels
          </button>
        </div>

        {/* Channel Direct Connect Quick Links */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400">Follow Channels:</span>
          <a
            href="https://www.youtube.com/@thebrookchurchng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            @thebrookchurchng (YouTube)
          </a>
          <span className="text-slate-300">&bull;</span>
          <a
            href="https://web.facebook.com/thebrookchurchng/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Facebook
          </a>
          <span className="text-slate-300">&bull;</span>
          <a
            href="https://www.instagram.com/thebrookchurchng/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 hover:underline"
          >
            Instagram
          </a>
        </div>
      </div>

      {/* Featured Messages Layout: Spotlight Hero + Responsive Grid */}
      <div className="mt-8 space-y-8">
        {/* Spotlight Hero Card */}
        {heroMessage && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all hover:shadow-2xl">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              {/* Media Preview Column */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900 lg:col-span-7">
                <Image
                  src={heroMessage.thumbnailUrl}
                  alt={heroMessage.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />

                {/* Platform Badge Overlay */}
                <div className="absolute left-4 top-4">
                  {heroMessage.platform === "youtube" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube Service
                    </span>
                  )}
                  {heroMessage.platform === "facebook" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook Live
                    </span>
                  )}
                  {heroMessage.platform === "instagram" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
                      Instagram Reel
                    </span>
                  )}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 rounded-md bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs">
                  {heroMessage.duration}
                </div>

                {/* Center Play Button Overlay */}
                <button
                  type="button"
                  onClick={() => {
                    if (heroMessage.youtubeId) {
                      setModalVideoId(heroMessage.youtubeId);
                    } else {
                      window.open(heroMessage.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-90 transition-opacity hover:opacity-100 hover:bg-black/40 group"
                  aria-label={`Play ${heroMessage.title}`}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xl transition duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Information Column */}
              <div className="p-6 lg:p-8 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                    <span>{heroMessage.program}</span>
                    <span>&bull;</span>
                    <span>{heroMessage.date}</span>
                  </div>

                  <h3 className="mt-2 font-serif text-2xl font-bold text-slate-900 leading-snug">
                    {heroMessage.title}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {heroMessage.subtitle}
                  </p>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {heroMessage.summary}
                  </p>

                  {heroMessage.scripture && (
                    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Scripture Reference: </span>
                      <span className="italic">{heroMessage.scripture}</span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{heroMessage.speaker}</span>
                    {heroMessage.viewsOrEngagement && (
                      <>
                        <span>&bull;</span>
                        <span>{heroMessage.viewsOrEngagement}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                  {heroMessage.youtubeId ? (
                    <button
                      type="button"
                      onClick={() => setModalVideoId(heroMessage.youtubeId!)}
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Watch Online Player
                    </button>
                  ) : null}

                  <a
                    href={heroMessage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Open on {heroMessage.platform === "youtube" ? "YouTube" : heroMessage.platform === "facebook" ? "Facebook" : "Instagram"} ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridMessages.map((msg) => (
            <div
              key={msg.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:shadow-lg hover:border-slate-300"
            >
              <div>
                {/* Media Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <Image
                    src={msg.thumbnailUrl}
                    alt={msg.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Platform Tag */}
                  <div className="absolute left-3 top-3">
                    {msg.platform === "youtube" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                        YouTube
                      </span>
                    )}
                    {msg.platform === "facebook" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                        Facebook
                      </span>
                    )}
                    {msg.platform === "instagram" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                        Instagram
                      </span>
                    )}
                  </div>

                  {/* Duration Tag */}
                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {msg.duration}
                  </span>

                  {/* Play Action Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      if (msg.youtubeId) {
                        setModalVideoId(msg.youtubeId);
                      } else {
                        window.open(msg.url, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Play ${msg.title}`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-xl transition-transform group-hover:scale-110">
                      <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-sky-700">{msg.program}</span>
                    <span>{msg.date}</span>
                  </div>

                  <h4 className="mt-2 line-clamp-2 font-serif text-lg font-bold text-slate-900 group-hover:text-sky-700 transition">
                    {msg.title}
                  </h4>

                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                    {msg.summary}
                  </p>

                  {msg.scripture && (
                    <p className="mt-2 text-xs italic text-slate-500 font-mono">
                      📖 {msg.scripture}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{msg.speaker}</span>
                <a
                  href={msg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sky-600 hover:text-sky-800 hover:underline"
                >
                  Watch ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player (if YouTube video selected) */}
      {modalVideoId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setModalVideoId(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                The Brook Church &bull; Video Player
              </span>
              <button
                type="button"
                onClick={() => setModalVideoId(null)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title="The Brook Church Sermon Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
