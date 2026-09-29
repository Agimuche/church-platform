import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import {
  Video,
  Radio,
  ShoppingBag,
  FolderOpen,
  Receipt,
  HeartHandshake,
  MessageCircle,
  Megaphone,
  Users,
  Settings,
  Plus,
  Upload,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
    announcementsCount,
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
    prisma.announcement.count(),
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
    announcementsCount,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const QUICK_ACTIONS = [
    {
      title: "Upload Files & Videos",
      description: "Upload MP3 audios, MP4 videos, book PDFs, and images",
      href: "/admin/files",
      icon: Upload,
      color: "bg-blue-600 text-white",
    },
    {
      title: "Publish Sermon / Video",
      description: "Add new sermon title, YouTube/video link, speaker, and audio file",
      href: "/admin/sermons",
      icon: Video,
      color: "bg-purple-600 text-white",
    },
    {
      title: "Control Live Broadcast",
      description: "Start native stream, studio camera, or schedule service times",
      href: "/admin/live-streams",
      icon: Radio,
      color: "bg-red-600 text-white",
    },
    {
      title: "Add Store Product / Book",
      description: "List new ELDAD devotional, books, or digital downloads",
      href: "/admin/products",
      icon: ShoppingBag,
      color: "bg-emerald-600 text-white",
    },
    {
      title: "Post Announcement",
      description: "Pin alerts, ministry updates, and Sunday service notes",
      href: "/admin/announcements",
      icon: Megaphone,
      color: "bg-amber-600 text-white",
    },
    {
      title: "Env & Settings Guide",
      description: "Inspect active providers, database, and Vercel keys",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-slate-700 text-white",
    },
  ];

  const STAT_CARDS = [
    { label: "Sermons & Videos", value: stats.totalSermons, href: "/admin/sermons", icon: Video },
    { label: "Live Broadcasts", value: stats.liveNow > 0 ? "LIVE NOW" : `${stats.scheduledStreams} Scheduled`, href: "/admin/live-streams", icon: Radio, highlight: stats.liveNow > 0 },
    { label: "Files & Media", value: stats.totalMedia, href: "/admin/files", icon: FolderOpen },
    { label: "Store Orders", value: stats.totalOrders, href: "/admin/orders", icon: Receipt },
    { label: "Store Revenue", value: `₦${Number(stats.revenue).toLocaleString()}`, href: "/admin/orders", icon: ShoppingBag },
    { label: "Prayer Requests", value: stats.openPrayerRequests, href: "/admin/prayer-requests", icon: HeartHandshake },
    { label: "Counseling Requests", value: stats.openCounselingRequests, href: "/admin/counseling", icon: MessageCircle },
    { label: "Announcements", value: stats.announcementsCount, href: "/admin/announcements", icon: Megaphone },
    { label: "Registered Members", value: stats.totalMembers, href: "/admin/users", icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl tbc-hero-gradient p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-amber-300" />
              <span>The Brook Church Admin Console</span>
            </span>
            <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-bold">
              Content &amp; Platform Management
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-sky-100 max-w-xl">
              Update sermons, upload media files, broadcast live services, and manage resources across the entire church website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/files"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-sky-950 shadow-md hover:bg-sky-50 transition"
            >
              <Upload className="h-4 w-4 text-accent" />
              <span>Upload New File</span>
            </Link>
            <Link
              href="/admin/sermons"
              className="flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Sermon</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Hub: Direct Shortcuts to update content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-ink">
            Quick Actions &bull; Update Platform
          </h2>
          <span className="text-xs text-ink-muted">Click any tool to start editing</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-paper p-5 shadow-xs tbc-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.color} shadow-sm transition group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                  <h3 className="mt-4 font-serif text-base font-bold text-ink group-hover:text-accent transition">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center text-[11px] font-bold text-accent">
                  <span>Open Tool</span>
                  <span className="ml-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Platform Analytics & Counts */}
      <div>
        <h2 className="font-serif text-lg font-bold text-ink mb-4">
          Overview &amp; Records
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="flex items-center justify-between rounded-2xl border border-border bg-paper p-4 shadow-xs tbc-card-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-tint border border-border text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">{card.label}</p>
                    <p className={`text-xl font-bold ${card.highlight ? "text-red-500 animate-pulse" : "text-ink"}`}>
                      {card.value}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-accent">View →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
