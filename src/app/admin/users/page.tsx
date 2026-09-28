import { requirePermission } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requirePermission("user:manage");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Users</h1>
      <p className="mt-1 text-sm text-ink-muted">{users.length} most recent accounts.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-tint text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                <td className="px-4 py-3 text-ink-muted">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={u.isActive ? "text-green-700" : "text-red-600"}>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
