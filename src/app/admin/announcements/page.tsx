import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  await requirePermission("announcement:manage");

  const announcements = await prisma.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { publishAt: "desc" }],
    take: 100,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Announcements</h1>
      <p className="mt-1 text-sm text-ink-muted">{announcements.length} announcements.</p>

      <div className="mt-6 space-y-3">
        {announcements.length === 0 ? (
          <p className="text-sm text-ink-muted">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-paper p-4">
              <div className="flex items-center gap-2">
                {a.isPinned && <Badge variant="gold">Pinned</Badge>}
                <p className="font-medium text-ink">{a.title}</p>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{a.body}</p>
              <p className="mt-2 text-xs text-ink-muted">
                Publishes {formatDate(a.publishAt)}
                {a.expiresAt && ` · Expires ${formatDate(a.expiresAt)}`}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
