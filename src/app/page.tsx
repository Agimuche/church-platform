import Link from "next/link";
import { getCurrentLiveStream, getNextScheduledStream } from "@/lib/data/streams";
import { getFeaturedSermon, getLatestSermon, listSermons } from "@/lib/data/media";
import { listActiveAnnouncements } from "@/lib/data/announcements";
import { listFeaturedProducts } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { MediaCard } from "@/components/ui/media-card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FeaturedMessagesSection } from "@/components/home/featured-messages-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    liveStream,
    nextStream,
    featuredSermon,
    latestSermon,
    recentSermons,
    announcements,
    products,
  ] = await Promise.all([
    getCurrentLiveStream(),
    getNextScheduledStream(),
    getFeaturedSermon(),
    getLatestSermon(),
    listSermons({ pageSize: 4 }),
    listActiveAnnouncements(3),
    listFeaturedProducts(4),
  ]);

  const heroSermon = featuredSermon ?? latestSermon;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden tbc-hero-gradient text-white py-16 sm:py-24 shadow-lg">
        {/* Decorative background glow circles */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="container-app relative grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {liveStream ? (
                <Badge variant="live" className="shadow-xs">
                  ● Live Service in Progress
                </Badge>
              ) : nextStream ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  Next Service &bull; {formatDate(nextStream.scheduledStart)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  The Brook Church, Calabar
                </span>
              )}
            </div>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              An Unfolding Story of God&apos;s Grace
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-sky-100 sm:text-lg">
              {liveStream
                ? liveStream.description ?? "Join our live service broadcast right now."
                : "Welcome to The Brook Church. Discover the power of Grace, the ministry of the Holy Spirit (Pneumatology), and walk in the exceptional life designed for you."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/live"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-sky-900 shadow-md transition hover:bg-sky-50 hover:scale-105"
              >
                <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                {liveStream ? "Watch Live Now" : "Live Broadcast"}
              </Link>
              <Link
                href="/sermons"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Browse Sermons
              </Link>
              <Link
                href="/give"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
              >
                Give Online
              </Link>
            </div>
          </div>

          {/* Hero Video Preview / Stream Frame */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/20 bg-slate-950 shadow-2xl">
            {liveStream ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white">
                <span className="text-sm text-red-400 font-bold animate-pulse">● LIVE NOW</span>
                <p className="mt-2 text-xl font-bold">{liveStream.title}</p>
                <p className="mt-1 text-xs text-slate-400">Streaming live on web and Facebook</p>
                <a
                  href="/live"
                  className="mt-4 rounded-full bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition"
                >
                  Watch Live Now →
                </a>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/Ya3yIiRPqT0?rel=0&modestbranding=1&controls=1"
                title="The Brook Church — Latest Broadcast"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>

        </div>
      </section>

      {/* 2. Weekly Service Schedules Grid */}
      <section className="container-app">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Worship With Us
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">
            Weekly Service Times
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join us in person at Asim Oko Street, Off Parliamentary Ext., Calabar or connect online.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs tbc-card-hover">
            <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
              Sunday 1st Service
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">PHRONESIS</h3>
            <p className="mt-1 text-2xl font-bold text-sky-600">8:00 AM</p>
            <p className="mt-2 text-xs text-slate-500">
              Practical wisdom and spiritual understanding for daily living.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs tbc-card-hover">
            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
              Sunday 2nd Service
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">DOXA</h3>
            <p className="mt-1 text-2xl font-bold text-purple-700">9:15 AM</p>
            <p className="mt-2 text-xs text-slate-500">
              An atmosphere of intense glory, worship, and the manifested presence of God.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs tbc-card-hover">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Tuesday Morning
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">ACCELERATE</h3>
            <p className="mt-1 text-2xl font-bold text-amber-700">6:00 AM</p>
            <p className="mt-2 text-xs text-slate-500">
              Morning prayer meeting to ignite supernatural speed and breakthroughs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs tbc-card-hover">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              Wednesday Evening
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">WORDSHOP</h3>
            <p className="mt-1 text-2xl font-bold text-emerald-700">6:00 PM</p>
            <p className="mt-2 text-xs text-slate-500">
              Mid-week in-depth exposition and interactive teaching of the Scriptures.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Welcome from Pastors Ose & Naomi Imiemohon */}
      <section className="container-app">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                From the Pastoral Desk
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                &ldquo;Destiny determines the route you take in life.&rdquo;
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Welcome to The Brook Church family. We hold dearly to the ability of God being
                expressed through us. One word that explains what we believe is{" "}
                <strong className="text-sky-700 font-semibold">GRACE</strong> — the divine
                empowerment upon the spirit of man to accomplish extraordinary exploits.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-sm">
                  PST
                </div>
                <div>
                  <p className="font-bold text-slate-900">Pastors Ose &amp; Naomi Imiemohon</p>
                  <p className="text-xs text-slate-500">Presiding Lead Pastors, The Brook Church</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-2xl bg-sky-50 border border-sky-100 p-6">
              <h3 className="font-serif text-lg font-bold text-sky-950">The Divine Mandate</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                &ldquo;You will teach Pneumatology; the way and things of the Spirit... Creative
                abilities will be your major, empowering men in their generation, healing of the mind
                will be your specialty.&rdquo;
              </p>
              <Link
                href="/about"
                className="mt-4 inline-block text-xs font-bold text-sky-700 hover:underline"
              >
                Read our full story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Brook Church Expansion Project Feature */}
      <section className="container-app">
        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                Priority Ministry Initiative
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-white">
                The Brook Church Expansion Project
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                As God continues to add to us in Calabar and around the globe, we are expanding our
                worship sanctuary and media infrastructure to minister to more souls. Join hands with
                us in building a house for the Lord.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="https://dashboard.flutterwave.com/donate/dv6jh1y3sp3t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-amber-400"
                >
                  Contribute via Flutterwave
                </a>
                <Link
                  href="/give"
                  className="rounded-full border border-slate-700 px-6 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  View Bank Details &amp; Giving Guide
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-2xl bg-slate-800/80 border border-slate-700 p-6 text-center">
              <p className="text-xs uppercase font-semibold tracking-wider text-amber-300">
                Partner with us today
              </p>
              <p className="mt-2 text-2xl font-bold text-white">Build with Grace</p>
              <p className="mt-2 text-xs text-slate-400">
                Every seed sown accelerates the physical manifestation of this vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Messages (YouTube, Facebook, Instagram) */}
      <FeaturedMessagesSection />

      {/* 6. TBC Store Spotlight (ELDAD Devotional & Books) */}
      {products.length > 0 && (
        <section className="container-app">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Spiritual Resources
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                From the TBC Store
              </h2>
            </div>
            <Link
              href="/store"
              className="text-sm font-semibold text-sky-600 hover:text-sky-800 transition"
            >
              Browse all store items →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/store/${product.slug}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-xs tbc-card-hover"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-slate-100 flex items-center justify-center text-sky-800 font-bold p-4 text-center text-sm">
                  <span>📖 {product.name}</span>
                </div>
                <h3 className="mt-3 line-clamp-2 font-medium text-slate-900 group-hover:text-sky-600 transition">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-bold text-sky-700">
                  {formatCurrency(product.price.toString())}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. Pastoral Care: Prayer Requests & Counseling */}
      <section className="container-app grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            News &amp; Updates
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            Announcements
          </h2>
          <div className="mt-6 space-y-4">
            {announcements.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                No new announcements at the moment. Join us this Sunday for Phronesis (8:00 AM) and
                Doxa (9:15 AM)!
              </div>
            ) : (
              announcements.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    {a.isPinned && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        Important
                      </span>
                    )}
                    <p className="font-bold text-slate-900">{a.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.body}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <span className="text-2xl">🙏</span>
            <h3 className="mt-2 font-serif text-lg font-bold text-slate-900">Need Prayer?</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Our intercessory pastoral prayer team is standing by to pray with you.
            </p>
            <LinkButton href="/prayer" size="sm" className="mt-4 w-full">
              Submit Prayer Request
            </LinkButton>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <span className="text-2xl">💬</span>
            <h3 className="mt-2 font-serif text-lg font-bold text-slate-900">Talk to a Pastor</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Schedule a confidential pastoral counseling appointment with our ministers.
            </p>
            <LinkButton href="/counseling" size="sm" variant="secondary" className="mt-4 w-full">
              Request Counseling
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
