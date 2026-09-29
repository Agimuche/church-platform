import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import {
  LayoutDashboard,
  Users,
  Video,
  Radio,
  ShoppingBag,
  Receipt,
  HeartHandshake,
  MessageCircle,
  Megaphone,
  FolderOpen,
  Settings,
  Sparkles,
} from "lucide-react";

const NAV_SECTIONS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Sermons & Media", href: "/admin/sermons", icon: Video },
  { label: "Live Streams", href: "/admin/live-streams", icon: Radio },
  { label: "Products & Store", href: "/admin/products", icon: ShoppingBag },
  { label: "File Manager", href: "/admin/files", icon: FolderOpen },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Prayer Requests", href: "/admin/prayer-requests", icon: HeartHandshake },
  { label: "Counseling", href: "/admin/counseling", icon: MessageCircle },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Users & Roles", href: "/admin/users", icon: Users },
  { label: "Settings & Env", href: "/admin/settings", icon: Settings },
];

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !ADMIN_ROLES.has(session.user.role)) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4.5rem)] bg-background text-ink transition-colors">
      {/* Mobile Top Navigation Scroller */}
      <div className="lg:hidden border-b border-border bg-paper p-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {NAV_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-border bg-surface-tint px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-paper/95 backdrop-blur-md text-ink lg:flex lg:flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-2.5 pb-5 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm leading-tight text-ink">The Brook Church</p>
              <p className="text-[11px] font-semibold text-accent">Admin Portal</p>
            </div>
          </div>

          <nav className="mt-5 flex flex-col gap-1">
            {NAV_SECTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-ink-muted hover:bg-surface-tint hover:text-accent transition group"
                >
                  <Icon className="h-4 w-4 transition group-hover:scale-110" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-border mt-6">
          <p className="text-xs font-bold text-ink truncate">{session.user.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-accent">
              {session.user.role}
            </span>
          </div>
          <Link
            href="/"
            className="mt-3 block text-center rounded-lg border border-border bg-surface-tint py-1.5 text-[11px] font-semibold text-ink hover:bg-paper transition"
          >
            ← View Live Website
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
