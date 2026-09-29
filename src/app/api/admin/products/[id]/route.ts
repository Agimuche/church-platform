import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.slug ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.type ? { type: data.type } : {}),
        ...(data.price !== undefined ? { price: parseFloat(data.price) } : {}),
        ...(data.images ? { images: data.images } : {}),
        ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
        ...(data.inventoryCount !== undefined ? { inventoryCount: data.inventoryCount !== null && data.inventoryCount !== "" ? parseInt(data.inventoryCount, 10) : null } : {}),
        ...(data.digitalFileUrl !== undefined ? { digitalFileUrl: data.digitalFileUrl } : {}),
        ...(data.isPublished !== undefined ? { isPublished: Boolean(data.isPublished) } : {}),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
  }
}
