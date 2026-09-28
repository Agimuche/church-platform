import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // New accounts default to MEMBER — visitors browse without an account,
  // and no role above MEMBER can be self-assigned through registration.
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "MEMBER" },
    select: { id: true, name: true, email: true, role: true },
  });

  return Response.json({ user }, { status: 201 });
}
