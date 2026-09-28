import "server-only";
import { prisma } from "@/lib/db/prisma";
import { MediaType, Prisma } from "@prisma/client";

const PUBLIC_MEDIA_INCLUDE = {
  speaker: true,
  category: true,
  tags: true,
} satisfies Prisma.MediaInclude;

export async function getFeaturedSermon() {
  return prisma.media.findFirst({
    where: { isPublished: true, isFeatured: true, type: { in: ["SERMON_VIDEO", "SERMON_AUDIO"] } },
    orderBy: { publishedAt: "desc" },
    include: PUBLIC_MEDIA_INCLUDE,
  });
}

export async function getLatestSermon() {
  return prisma.media.findFirst({
    where: { isPublished: true, type: { in: ["SERMON_VIDEO", "SERMON_AUDIO"] } },
    orderBy: { publishedAt: "desc" },
    include: PUBLIC_MEDIA_INCLUDE,
  });
}

export interface SermonListFilters {
  page?: number;
  pageSize?: number;
  query?: string;
  speakerId?: string;
  categoryId?: string;
  type?: MediaType;
  sort?: "newest" | "oldest" | "popular";
}

export async function listSermons(filters: SermonListFilters = {}) {
  const { page = 1, pageSize = 12, query, speakerId, categoryId, type, sort = "newest" } = filters;

  const where: Prisma.MediaWhereInput = {
    isPublished: true,
    type: type ?? { in: ["SERMON_VIDEO", "SERMON_AUDIO"] },
    ...(speakerId ? { speakerId } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.MediaOrderByWithRelationInput =
    sort === "oldest"
      ? { publishedAt: "asc" }
      : sort === "popular"
        ? { viewCount: "desc" }
        : { publishedAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy,
      include: PUBLIC_MEDIA_INCLUDE,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.media.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getSermonBySlug(slug: string) {
  return prisma.media.findFirst({
    where: { slug, isPublished: true },
    include: PUBLIC_MEDIA_INCLUDE,
  });
}

export async function getRelatedSermons(mediaId: string, speakerId?: string | null, take = 4) {
  return prisma.media.findMany({
    where: {
      id: { not: mediaId },
      isPublished: true,
      type: { in: ["SERMON_VIDEO", "SERMON_AUDIO"] },
      ...(speakerId ? { speakerId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take,
    include: PUBLIC_MEDIA_INCLUDE,
  });
}

export async function listSpeakers() {
  return prisma.speaker.findMany({ orderBy: { name: "asc" } });
}

export async function listMediaCategories() {
  return prisma.category.findMany({ where: { type: "media" }, orderBy: { name: "asc" } });
}
