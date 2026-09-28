import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { counselingRequestSchema } from "@/lib/validation/requests";

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json().catch(() => null);
  const parsed = counselingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
  }

  if (!session?.user && !parsed.data.guestEmail) {
    return Response.json({ error: "Please provide an email so a pastor can reach you." }, { status: 400 });
  }

  const request = await prisma.counselingRequest.create({
    data: {
      category: parsed.data.category,
      description: parsed.data.description,
      preferredDate: parsed.data.preferredDate ? new Date(parsed.data.preferredDate) : undefined,
      requesterId: session?.user?.id,
      guestName: session?.user ? undefined : parsed.data.guestName,
      guestEmail: session?.user ? undefined : parsed.data.guestEmail,
      guestPhone: session?.user ? undefined : parsed.data.guestPhone,
    },
    select: { id: true, createdAt: true },
  });

  return Response.json({ request }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Sign in to view your counseling requests." }, { status: 401 });
  }

  const requests = await prisma.counselingRequest.findMany({
    where: { requesterId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { appointment: true },
  });

  return Response.json({ requests });
}
