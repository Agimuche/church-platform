import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function listActiveAnnouncements(take = 6) {
  const now = new Date();
  return prisma.announcement.findMany({
    where: {
      publishAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
    },
    orderBy: [{ isPinned: "desc" }, { publishAt: "desc" }],
    take,
  });
}
