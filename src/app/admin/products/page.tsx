import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requirePermission("product:manage");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">{products.length} products.</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-tint text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No products yet. Products are created via the API / a future admin form.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatCurrency(p.price.toString())}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.inventoryCount ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isPublished ? "default" : "muted"}>
                      {p.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
