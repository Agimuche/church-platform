import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

const NAV_SECTIONS: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Sermons & Media", href: "/admin/sermons" },
  { label: "Live Streams", href: "/admin/live-streams" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Prayer Requests", href: "/admin/prayer-requests" },
  { label: "Counseling", href: "/admin/counseling" },
  { label: "Announcements", href: "/admin/announcements" },
  { label: "Settings", href: "/admin/settings" },
];

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !ADMIN_ROLES.has(session.user.role)) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-surface-tint">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-ink text-white lg:block">
        <div className="p-5">
          <p className="font-serif text-lg font-semibold">Admin</p>
          <p className="mt-1 text-xs text-white/60">Signed in as {session.user.name} · {session.user.role}</p>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3 text-sm">
          {NAV_SECTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
