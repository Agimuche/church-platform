import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "TBC Store & Publications | The Brook Church",
  description:
    "Explore books, audio messages, and daily devotionals from The Brook Church including ELDAD (The Exceptional Life Daily Devotional), Called To Flourish, and teaching series.",
};

interface StorePageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const { items, totalPages } = await listProducts({ query: params.q, page });

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="container-app">
        {/* Header Hero */}
        <div className="rounded-3xl tbc-hero-gradient p-8 text-white shadow-xl sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              TBC Store &amp; Media Resources
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
              Books, Messages &amp; ELDAD Devotional
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Empower your spirit with inspired publications from Pastor Ose Imiemohon, Pastor Naomi
              Imiemohon, and The Brook Church ministers. Instant digital downloads and physical books
              shipped worldwide.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Available Resources</h2>
            <p className="text-xs text-slate-500">
              Browse devotional guides, MP3 audio teachings, and ebooks.
            </p>
          </div>

          <form className="max-w-md w-full" action="/store" method="get">
            <div className="relative">
              <input
                type="search"
                name="q"
                defaultValue={params.q}
                placeholder="Search by title, author, or keyword…"
                className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 pl-11 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
              <span className="absolute left-4 top-3 text-slate-400">🔍</span>
            </div>
          </form>
        </div>

        {/* Product Grid */}
        {items.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <p className="text-base font-semibold text-slate-700">No products found matching your search.</p>
            <p className="mt-1 text-xs text-slate-500">Try searching for &apos;ELDAD&apos;, &apos;Devotional&apos;, or browse all items.</p>
            <Link
              href="/store"
              className="mt-4 inline-block rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              Clear Search
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <Link
                key={product.id}
                href={`/store/${product.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs tbc-card-hover"
              >
                <div>
                  <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-slate-100 flex flex-col items-center justify-center p-6 text-center border border-slate-100">
                    <span className="text-4xl">📖</span>
                    <span className="mt-3 text-xs font-bold text-sky-900 line-clamp-2">
                      {product.name}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold text-slate-900 group-hover:text-sky-600 transition line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-bold text-sky-700">
                    {formatCurrency(product.price.toString())}
                  </span>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition">
                    View &amp; Buy
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={{ pathname: "/store", query: { ...params, page: p } }}
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
