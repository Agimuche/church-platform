import { StorageProvider } from "./types";
import { localStorageProvider } from "./local-provider";

export * from "./types";

let cached: StorageProvider | null = null;

/**
 * Returns the configured StorageProvider.
 *
 * STORAGE_PROVIDER=local (default) — writes to disk, zero setup.
 * STORAGE_PROVIDER=s3 — requires AWS credentials + the AWS SDK (see s3-provider.ts).
 */
export async function getStorageProvider(): Promise<StorageProvider> {
  if (cached) return cached;

  const provider = process.env.STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      cached = localStorageProvider;
      return cached;
    case "s3": {
      const { S3StorageProvider } = await import("./s3-provider");
      cached = new S3StorageProvider(
        process.env.S3_BUCKET_NAME ?? "",
        process.env.S3_PUBLIC_BASE_URL ?? ""
      );
      return cached;
    }
    default:
      throw new Error(
        `Unknown STORAGE_PROVIDER "${provider}". Add an implementation in src/lib/providers/storage/ and register it here.`
      );
  }
}
