import { requirePermission, guardErrorResponse } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["REQUESTED", "ACCEPTED", "DECLINED", "SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  privateNotes: z.string().max(2000).optional(),
  handledById: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission("counseling:manage");
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.counselingRequest.update({
      where: { id },
      data: {
        ...parsed.data,
        handledById: parsed.data.handledById ?? session.user.id,
      },
    });

    return Response.json({ request: updated });
  } catch (error) {
    return guardErrorResponse(error);
  }
}
