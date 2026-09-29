import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.media.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.type ? { type: data.type } : {}),
        ...(data.speakerId !== undefined ? { speakerId: data.speakerId } : {}),
        ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
        ...(data.thumbnailUrl !== undefined ? { thumbnailUrl: data.thumbnailUrl } : {}),
        ...(data.fileUrl !== undefined ? { fileUrl: data.fileUrl } : {}),
        ...(data.durationSeconds !== undefined ? { durationSeconds: parseInt(data.durationSeconds, 10) } : {}),
        ...(data.visibility ? { visibility: data.visibility } : {}),
        ...(data.price !== undefined ? { price: data.price ? parseFloat(data.price) : null } : {}),
        ...(data.allowDownload !== undefined ? { allowDownload: Boolean(data.allowDownload) } : {}),
        ...(data.isPublished !== undefined ? { isPublished: Boolean(data.isPublished) } : {}),
        ...(data.isFeatured !== undefined ? { isFeatured: Boolean(data.isFeatured) } : {}),
      },
      include: { speaker: true, category: true },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update sermon" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete sermon" }, { status: 500 });
  }
}
