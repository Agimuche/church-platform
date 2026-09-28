import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { StatusSelect } from "@/components/admin/status-select";

export const dynamic = "force-dynamic";

export default async function AdminCounselingPage() {
  await requirePermission("counseling:manage");

  const requests = await prisma.counselingRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { requester: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Counseling Requests</h1>
      <p className="mt-1 text-sm text-ink-muted">Confidential — visible only to pastors and administrators.</p>

      <div className="mt-6 space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-ink-muted">No counseling requests yet.</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{r.category}</p>
                  <p className="text-sm text-ink-muted">
                    {r.requester?.name ?? r.guestName} · {formatDate(r.createdAt)}
                    {r.preferredDate && ` · Prefers ${formatDate(r.preferredDate)}`}
                  </p>
                </div>
                <StatusSelect
                  id={r.id}
                  currentStatus={r.status}
                  options={["REQUESTED", "ACCEPTED", "DECLINED", "SCHEDULED", "COMPLETED", "CANCELLED"]}
                  endpoint="/api/admin/counseling-requests"
                />
              </div>
              <p className="mt-3 text-sm text-ink">{r.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
