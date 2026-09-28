import { promises as fs } from "fs";
import path from "path";
import { StorageProvider, UploadInput } from "./types";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".local-storage");
const LOCAL_URL_PREFIX = "/api/local-storage";

/**
 * Writes files to disk under .local-storage/. Good enough for development
 * and demos; not suitable for production (use the S3 provider there).
 * Files are served back through /api/local-storage/[...key].
 */
class LocalStorageProvider implements StorageProvider {
  readonly name = "local";

  async upload({ key, body }: UploadInput): Promise<{ key: string }> {
    const filePath = path.join(LOCAL_STORAGE_DIR, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, body);
    return { key };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(LOCAL_STORAGE_DIR, key);
    await fs.rm(filePath, { force: true });
  }

  getUrl(key: string): string {
    return `${LOCAL_URL_PREFIX}/${key}`;
  }

  async getSignedUrl(key: string): Promise<string> {
    // No real signing locally — same static path, good enough for dev.
    return this.getUrl(key);
  }
}

export const localStorageProvider = new LocalStorageProvider();
