import { requirePermission } from "@/lib/rbac/guard";
import { FileManager } from "@/components/admin/file-manager";

export const dynamic = "force-dynamic";

export default async function AdminFilesPage() {
  await requirePermission("media:upload");

  return <FileManager />;
}
