import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { StatusSelect } from "@/components/admin/status-select";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminPrayerRequestsPage() {
  await requirePermission("prayer:manage");

  const requests = await prisma.prayerRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { requester: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Prayer Requests</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Private requests are only visible to pastors and administrators.
      </p>

      <div className="mt-6 space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-ink-muted">No prayer requests yet.</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={r.visibility === "PUBLIC" ? "gold" : "muted"}>{r.visibility}</Badge>
                  <span className="text-sm text-ink-muted">
                    {r.requester?.name ?? r.guestName ?? "Anonymous"} · {formatDate(r.createdAt)}
                  </span>
                </div>
                <StatusSelect
                  id={r.id}
                  currentStatus={r.status}
                  options={["NEW", "IN_PROGRESS", "PRAYED_FOR", "CLOSED"]}
                  endpoint="/api/admin/prayer-requests"
                />
              </div>
              <p className="mt-3 text-sm text-ink">{r.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
