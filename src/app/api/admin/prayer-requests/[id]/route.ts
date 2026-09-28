import { requirePermission, guardErrorResponse } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "PRAYED_FOR", "CLOSED"]).optional(),
  internalNote: z.string().max(2000).optional(),
  assigneeId: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("prayer:manage");
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.prayerRequest.update({ where: { id }, data: parsed.data });
    return Response.json({ request: updated });
  } catch (error) {
    return guardErrorResponse(error);
  }
}
