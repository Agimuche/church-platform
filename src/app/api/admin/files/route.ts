import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { promises as fs } from "fs";
import path from "path";

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export async function GET() {
  const session = await auth();
  if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const files: any[] = [];

  // Read from .local-storage/uploads if exists
  const localStorageDir = path.join(process.cwd(), ".local-storage", "uploads");
  try {
    const entries = await fs.readdir(localStorageDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const stats = await fs.stat(path.join(localStorageDir, entry.name));
        files.push({
          key: `uploads/${entry.name}`,
          name: entry.name,
          url: `/api/local-storage/uploads/${entry.name}`,
          size: stats.size,
          updatedAt: stats.mtime,
          source: "local-storage",
        });
      }
    }
  } catch {
    // Ignore if dir doesn't exist
  }

  // Also read from public/uploads
  const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
  try {
    const entries = await fs.readdir(publicUploadsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && !files.some((f) => f.name === entry.name)) {
        const stats = await fs.stat(path.join(publicUploadsDir, entry.name));
        files.push({
          key: `uploads/${entry.name}`,
          name: entry.name,
          url: `/uploads/${entry.name}`,
          size: stats.size,
          updatedAt: stats.mtime,
          source: "public",
        });
      }
    }
  } catch {
    // Ignore
  }

  return NextResponse.json(files);
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { key } = await req.json();
    if (!key) {
      return NextResponse.json({ error: "Key required" }, { status: 400 });
    }

    const filename = path.basename(key);
    const localPath = path.join(process.cwd(), ".local-storage", key);
    const publicPath = path.join(process.cwd(), "public", "uploads", filename);

    try { await fs.rm(localPath, { force: true }); } catch {}
    try { await fs.rm(publicPath, { force: true }); } catch {}

    return NextResponse.json({ success: true, deletedKey: key });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete file" }, { status: 500 });
  }
}
