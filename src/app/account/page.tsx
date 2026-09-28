import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  // middleware already redirects unauthenticated users away from /account,
  // but guard again here in case this page is ever reached directly.
  if (!session?.user) return null;

  const [orders, prayerRequests, counselingRequests, bookmarks] = await Promise.all([
    prisma.order.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.prayerRequest.count({ where: { requesterId: session.user.id } }),
    prisma.counselingRequest.count({ where: { requesterId: session.user.id } }),
    prisma.bookmark.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="container-app py-12">
      <h1 className="font-serif text-3xl font-semibold text-ink">My Account</h1>
      <p className="mt-1 text-ink-muted">Welcome back, {session.user.name}.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-paper p-5">
          <p className="text-sm text-ink-muted">Prayer Requests</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{prayerRequests}</p>
        </div>
        <div className="rounded-xl border border-border bg-paper p-5">
          <p className="text-sm text-ink-muted">Counseling Requests</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{counselingRequests}</p>
        </div>
        <div className="rounded-xl border border-border bg-paper p-5">
          <p className="text-sm text-ink-muted">Saved Sermons</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{bookmarks}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-ink">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">
            No orders yet. <LinkButton href="/store" size="sm" variant="secondary" className="ml-2">Visit the Store</LinkButton>
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-border bg-paper p-4 text-sm">
                <span className="text-ink-muted">{formatDate(o.createdAt)}</span>
                <span className="font-medium text-ink">{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
