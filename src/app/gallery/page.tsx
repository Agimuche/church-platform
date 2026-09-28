import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 24,
    include: { _count: { select: { items: true } } },
  });

  return (
    <div className="container-app py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">Gallery</h1>
      <p className="mt-2 max-w-xl text-ink-muted">Photo albums from services, events, and church life.</p>

      {galleries.length === 0 ? (
        <p className="mt-16 text-center text-ink-muted">No albums published yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleries.map((g) => (
            <Link key={g.id} href={`/gallery/${g.slug}`} className="group block">
              <div className="aspect-square overflow-hidden rounded-xl border border-border bg-surface-tint" />
              <h3 className="mt-3 line-clamp-2 font-medium text-ink group-hover:text-accent">{g.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{g._count.items} photos</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
