import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const ADMIN_ROLES = new Set(["MEDIA_TEAM", "PASTOR", "ADMIN", "SUPER_ADMIN"]);

export async function GET() {
  const session = await auth();
  if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const items = await prisma.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { publishAt: "desc" }],
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

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        body: data.body,
        imageUrl: data.imageUrl || null,
        isPinned: Boolean(data.isPinned),
        publishAt: data.publishAt ? new Date(data.publishAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        createdById: session?.user?.id || "user-super-admin",
      },
    });

    return NextResponse.json({ success: true, item: announcement });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create announcement" }, { status: 500 });
  }
}
