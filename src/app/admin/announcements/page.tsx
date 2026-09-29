import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { AnnouncementAdminManager } from "@/components/admin/announcement-admin-manager";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  await requirePermission("announcement:manage");

  const announcements = await prisma.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { publishAt: "desc" }],
    take: 100,
  });

  return (
    <AnnouncementAdminManager
      initialAnnouncements={announcements.map((a) => ({
        ...a,
        publishAt: a.publishAt.toISOString(),
        expiresAt: a.expiresAt ? a.expiresAt.toISOString() : null,
      }))}
    />
  );
}
