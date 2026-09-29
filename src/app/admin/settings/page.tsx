import { requirePermission } from "@/lib/rbac/guard";
import { SettingsEnvironmentGuide } from "@/components/admin/settings-environment-guide";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requirePermission("settings:manage");

  return (
    <SettingsEnvironmentGuide
      currentEnv={{
        streamingProvider: process.env.STREAMING_PROVIDER ?? "mock",
        paymentProvider: process.env.PAYMENT_PROVIDER ?? "mock",
        storageProvider: process.env.STORAGE_PROVIDER ?? "local",
        nodeEnv: process.env.NODE_ENV ?? "development",
      }}
    />
  );
}
