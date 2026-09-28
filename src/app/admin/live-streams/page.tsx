import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { LiveStreamAdminPanel } from "@/components/admin/live-stream-admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminLiveStreamsPage() {
  await requirePermission("stream:manage");

  const streams = await prisma.liveStream.findMany({
    orderBy: { scheduledStart: "desc" },
    take: 50,
    select: { id: true, title: true, status: true, scheduledStart: true },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Live Streams</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Schedule, start, and stop services through the configured streaming provider.
      </p>

      <div className="mt-6">
        <LiveStreamAdminPanel
          streams={streams.map((s) => ({ ...s, scheduledStart: s.scheduledStart.toISOString() }))}
        />
      </div>
    </div>
  );
}
