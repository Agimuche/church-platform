import { promises as fs } from "fs";
import path from "path";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".local-storage");

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const filePath = path.join(LOCAL_STORAGE_DIR, ...key);

  // Prevent path traversal outside the storage root.
  if (!filePath.startsWith(LOCAL_STORAGE_DIR)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(filePath);
    return new Response(data);
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
