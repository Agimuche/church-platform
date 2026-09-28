import "server-only";
import { prisma } from "@/lib/db/prisma";
import { Prisma, ProductType } from "@prisma/client";

export async function listFeaturedProducts(take = 4) {
  return prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take,
    include: { category: true },
  });
}

export interface ProductListFilters {
  page?: number;
  pageSize?: number;
  query?: string;
  type?: ProductType;
  categoryId?: string;
}

export async function listProducts(filters: ProductListFilters = {}) {
  const { page = 1, pageSize = 12, query, type, categoryId } = filters;

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    ...(type ? { type } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
    include: { category: true },
  });
}
