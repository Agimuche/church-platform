import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);

export async function GET() {
  const session = await auth();
  if (session?.user?.role && !ADMIN_ROLES.has(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const items = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
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
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slug || `prod-${Date.now()}`,
        description: data.description || "",
        type: data.type || "DIGITAL_BOOK",
        price: parseFloat(data.price || "0"),
        images: data.images || (data.imageUrl ? [data.imageUrl] : []),
        categoryId: data.categoryId || null,
        inventoryCount: data.inventoryCount !== undefined && data.inventoryCount !== "" ? parseInt(data.inventoryCount, 10) : null,
        digitalFileUrl: data.digitalFileUrl || null,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        createdById: session?.user?.id || "user-super-admin",
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item: product });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}
