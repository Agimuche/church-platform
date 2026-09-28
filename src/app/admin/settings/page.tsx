import { requirePermission } from "@/lib/rbac/guard";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requirePermission("settings:manage");

  const rows = [
    { label: "Streaming Provider", value: process.env.STREAMING_PROVIDER ?? "mock" },
    { label: "Payment Provider", value: process.env.PAYMENT_PROVIDER ?? "mock" },
    { label: "Storage Provider", value: process.env.STORAGE_PROVIDER ?? "local" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Provider configuration is controlled by environment variables — see <code>.env.example</code>.
        This page is read-only in the MVP; wire up a form here once Super Admin self-service
        configuration is needed.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-paper">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{row.label}</td>
                <td className="px-4 py-3 text-ink-muted">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
