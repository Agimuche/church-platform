import { requirePermission, guardErrorResponse } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { getStreamingProvider } from "@/lib/providers/streaming";
import { createStreamSchema } from "@/lib/validation/streams";

export async function GET() {
  try {
    await requirePermission("stream:manage");
    const streams = await prisma.liveStream.findMany({ orderBy: { scheduledStart: "desc" }, take: 50 });
    return Response.json({ streams });
  } catch (error) {
    return guardErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requirePermission("stream:manage");
    const body = await req.json().catch(() => null);
    const parsed = createStreamSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const provider = getStreamingProvider();
    const handle = await provider.createStream({
      title: parsed.data.title,
      description: parsed.data.description,
    });

    let streamProvider = parsed.data.provider || provider.name;
    const playbackUrl = parsed.data.playbackUrl?.trim();
    if (playbackUrl && (!parsed.data.provider || parsed.data.provider === "mock")) {
      if (playbackUrl.includes("facebook.com") || playbackUrl.includes("fb.watch")) {
        streamProvider = "facebook";
      } else if (playbackUrl.includes("youtube.com") || playbackUrl.includes("youtu.be")) {
        streamProvider = "youtube";
      }
    }

    const stream = await prisma.liveStream.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        scheduledStart: new Date(parsed.data.scheduledStart),
        status: "SCHEDULED",
        provider: streamProvider,
        playbackUrl: playbackUrl || undefined,
        providerStreamId: handle.providerStreamId,
        createdById: session.user.id,
      },
    });

    return Response.json({ stream }, { status: 201 });
  } catch (error) {
    return guardErrorResponse(error);
  }
}
