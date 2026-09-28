import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "default" | "gold" | "muted"> = {
  PAID: "default",
  PENDING: "gold",
  FULFILLED: "default",
};

export default async function AdminOrdersPage() {
  await requirePermission("order:view:all");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } }, items: true },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink-muted">{orders.length} most recent orders.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-tint text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{o.user.name}</td>
                <td className="px-4 py-3 text-ink-muted">{o.items.length} item(s)</td>
                <td className="px-4 py-3 text-ink-muted">{formatCurrency(o.totalAmount.toString(), o.currency)}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[o.status] ?? "muted"}>{o.status}</Badge>
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
