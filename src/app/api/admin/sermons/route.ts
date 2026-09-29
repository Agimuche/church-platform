import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export async function GET() {
  const session = await auth();
  if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const items = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    include: { speaker: true, category: true },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();

    const slug =
      data.slug?.trim() ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const sermon = await prisma.media.create({
      data: {
        title: data.title,
        slug: slug || `sermon-${Date.now()}`,
        description: data.description || "",
        type: data.type || "SERMON_VIDEO",
        speakerId: data.speakerId || null,
        categoryId: data.categoryId || null,
        thumbnailUrl: data.thumbnailUrl || null,
        fileUrl: data.fileUrl || null,
        durationSeconds: data.durationSeconds ? parseInt(data.durationSeconds, 10) : null,
        visibility: data.visibility || "PUBLIC",
        price: data.price ? parseFloat(data.price) : null,
        allowDownload: Boolean(data.allowDownload),
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        isFeatured: Boolean(data.isFeatured),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        createdById: session?.user?.id || "user-super-admin",
      },
      include: { speaker: true, category: true },
    });

    return NextResponse.json({ success: true, item: sermon });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create sermon" }, { status: 500 });
  }
}
