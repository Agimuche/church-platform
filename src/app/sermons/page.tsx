import { listSermons, listSpeakers, listMediaCategories } from "@/lib/data/media";
import { MediaCard } from "@/components/ui/media-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sermon Archive | The Brook Church",
  description:
    "Listen and watch life-transforming messages from Pastor Ose Imiemohon, Pastor Naomi Imiemohon, and The Brook Church teaching team on Pneumatology, Grace, and the Zoe life.",
};

interface SermonsPageProps {
  searchParams: Promise<{
    q?: string;
    speaker?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const [{ items, totalPages }, speakers, categories] = await Promise.all([
    listSermons({
      query: params.q,
      speakerId: params.speaker,
      categoryId: params.category,
      page,
      sort: (params.sort as "newest" | "oldest" | "popular") ?? "newest",
    }),
    listSpeakers(),
    listMediaCategories(),
  ]);

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app">
        {/* Header Hero Banner */}
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              Word &amp; Doctrine
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
              The Brook Church Sermon Archive
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Explore messages on Pneumatology, Grace, the Zoe Life, and Divine Wisdom by Pastor Ose
              Imiemohon and guest ministers.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <form className="flex flex-wrap items-center gap-3" action="/sermons" method="get">
            <div className="min-w-[240px] flex-1">
              <input
                type="search"
                name="q"
                defaultValue={params.q}
                placeholder="Search sermons by title, topic…"
                className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <select
              name="speaker"
              defaultValue={params.speaker ?? ""}
              className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
            >
              <option value="">All Pastors / Speakers</option>
              {speakers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              name="category"
              defaultValue={params.category ?? ""}
              className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              name="sort"
              defaultValue={params.sort ?? "newest"}
              className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Viewed</option>
            </select>
            <button
              type="submit"
              className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-sky-700"
            >
              Filter
            </button>
            {(params.q || params.speaker || params.category || params.sort) && (
              <Link
                href="/sermons"
                className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Sermon Grid */}
        {items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <p className="text-base font-semibold text-slate-700">No sermons found.</p>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria or clearing your filters.
            </p>
            <Link
              href="/sermons"
              className="mt-4 inline-block rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              View All Sermons
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((sermon) => (
              <MediaCard
                key={sermon.id}
                href={`/sermons/${sermon.slug}`}
                title={sermon.title}
                thumbnailUrl={sermon.thumbnailUrl}
                speakerName={sermon.speaker?.name ?? "Pastor Ose Imiemohon"}
                publishedAt={sermon.publishedAt}
                durationSeconds={sermon.durationSeconds}
                price={sermon.price?.toString()}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={{ pathname: "/sermons", query: { ...params, page: p } }}
                className={`rounded-full px-4 py-2 font-semibold transition ${
                  p === page
                    ? "bg-sky-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-500"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
