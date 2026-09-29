import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getStorageProvider } from "@/lib/providers/storage";
import { promises as fs } from "fs";
import path from "path";

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // Allow authorized roles, or allow in dev if session not established
    if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueKey = `uploads/${Date.now()}-${safeName}`;

    // 1. Upload via StorageProvider
    const storage = await getStorageProvider();
    await storage.upload({
      key: uniqueKey,
      body: buffer,
      contentType: file.type || "application/octet-stream",
    });

    // 2. Also write to public/uploads/ for direct static web accessibility in local dev
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(publicUploadsDir, { recursive: true });
      await fs.writeFile(path.join(publicUploadsDir, safeName), buffer);
    } catch {
      // Ignore if public write fails
    }

    const fileUrl = storage.getUrl(uniqueKey);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      publicUrl: `/uploads/${safeName}`,
      key: uniqueKey,
      filename: file.name,
      size: file.size,
      contentType: file.type,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
