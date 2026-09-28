import "server-only";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import { hasPermission, Permission } from "./permissions";

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do this.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "You must be signed in.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Server-side guard for API routes and server actions. Never trust a role or
 * permission sent from the client — always re-derive it from the session.
 */
export async function requirePermission(permission: Permission) {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();

  const role = session.user.role as Role;
  if (!hasPermission(role, permission)) throw new ForbiddenError();

  return session;
}

export async function requireRole(...roles: Role[]) {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  if (!roles.includes(session.user.role as Role)) throw new ForbiddenError();
  return session;
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  return session;
}

/** Convert a guard error to a standard API response. */
export function guardErrorResponse(error: unknown) {
  if (error instanceof UnauthorizedError) {
    return Response.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof ForbiddenError) {
    return Response.json({ error: error.message }, { status: 403 });
  }
  return Response.json({ error: "Something went wrong." }, { status: 500 });
}
