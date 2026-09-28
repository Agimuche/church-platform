import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { prayerRequestSchema } from "@/lib/validation/requests";

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json().catch(() => null);
  const parsed = prayerRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
  }

  // Guests can submit too (Visitor permission), but must give a way to reach them.
  if (!session?.user && !parsed.data.guestEmail) {
    return Response.json({ error: "Please provide an email so we can follow up." }, { status: 400 });
  }

  const request = await prisma.prayerRequest.create({
    data: {
      message: parsed.data.message,
      visibility: parsed.data.visibility,
      requesterId: session?.user?.id,
      guestName: session?.user ? undefined : parsed.data.guestName,
      guestEmail: session?.user ? undefined : parsed.data.guestEmail,
    },
    select: { id: true, createdAt: true },
  });

  return Response.json({ request }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Sign in to view your prayer requests." }, { status: 401 });
  }

  const requests = await prisma.prayerRequest.findMany({
    where: { requesterId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ requests });
}
