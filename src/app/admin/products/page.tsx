import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { ProductAdminManager } from "@/components/admin/product-admin-manager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requirePermission("product:manage");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { category: true },
    }),
    prisma.category.findMany({ where: { type: "product" }, orderBy: { name: "asc" } }),
  ]);

  return (
    <ProductAdminManager
      initialProducts={products.map((p) => ({
        ...p,
        price: p.price.toString(),
        createdAt: p.createdAt.toISOString(),
      }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
