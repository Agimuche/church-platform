import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { SermonAdminManager } from "@/components/admin/sermon-admin-manager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requirePermission("media:edit");

  const [items, speakers, categories] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { speaker: true, category: true },
    }),
    prisma.speaker.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { type: "media" }, orderBy: { name: "asc" } }),
  ]);

  return (
    <SermonAdminManager
      initialSermons={items.map((it) => ({
        ...it,
        createdAt: it.createdAt.toISOString(),
        publishedAt: it.publishedAt ? it.publishedAt.toISOString() : null,
      }))}
      speakers={speakers.map((s) => ({ id: s.id, name: s.name }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
