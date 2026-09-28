import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requirePermission("media:edit");

  const items = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { speaker: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Sermons &amp; Media</h1>
          <p className="mt-1 text-sm text-ink-muted">{items.length} media items.</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-tint text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Speaker</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No media uploaded yet. Uploads are handled via the media API and StorageProvider.
                </td>
              </tr>
            ) : (
              items.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{m.title}</td>
                  <td className="px-4 py-3 text-ink-muted">{m.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-ink-muted">{m.speaker?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={m.isPublished ? "default" : "muted"}>
                      {m.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{formatDate(m.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
