import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const [
    totalMembers,
    totalMedia,
    totalSermons,
    liveNow,
    scheduledStreams,
    totalOrders,
    revenueAgg,
    openPrayerRequests,
    openCounselingRequests,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.media.count(),
    prisma.media.count({ where: { type: { in: ["SERMON_VIDEO", "SERMON_AUDIO"] } } }),
    prisma.liveStream.count({ where: { status: "LIVE" } }),
    prisma.liveStream.count({ where: { status: "SCHEDULED" } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalAmount: true } }),
    prisma.prayerRequest.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
    prisma.counselingRequest.count({ where: { status: { in: ["REQUESTED", "ACCEPTED"] } } }),
  ]);

  return {
    totalMembers,
    totalMedia,
    totalSermons,
    liveNow,
    scheduledStreams,
    totalOrders,
    revenue: revenueAgg._sum.totalAmount ?? 0,
    openPrayerRequests,
    openCounselingRequests,
  };
}

const CARDS = (stats: Awaited<ReturnType<typeof getDashboardStats>>) => [
  { label: "Members", value: stats.totalMembers, href: "/admin/users" },
  { label: "Media Items", value: stats.totalMedia, href: "/admin/sermons" },
  { label: "Sermons", value: stats.totalSermons, href: "/admin/sermons" },
  { label: "Live Now", value: stats.liveNow, href: "/admin/live-streams" },
  { label: "Scheduled Streams", value: stats.scheduledStreams, href: "/admin/live-streams" },
  { label: "Orders", value: stats.totalOrders, href: "/admin/orders" },
  { label: "Revenue (NGN)", value: Number(stats.revenue).toLocaleString(), href: "/admin/orders" },
  { label: "Open Prayer Requests", value: stats.openPrayerRequests, href: "/admin/prayer-requests" },
  { label: "Open Counseling", value: stats.openCounselingRequests, href: "/admin/counseling" },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">An overview of what&apos;s happening across the platform.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS(stats).map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-paper p-5 transition hover:border-accent"
          >
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
