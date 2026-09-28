import { requirePermission, guardErrorResponse } from "@/lib/rbac/guard";
import { prisma } from "@/lib/db/prisma";
import { getStreamingProvider } from "@/lib/providers/streaming";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("stream:manage");
    const { id } = await params;

    const stream = await prisma.liveStream.findUnique({ where: { id } });
    if (!stream || !stream.providerStreamId) {
      return Response.json({ error: "Stream not found." }, { status: 404 });
    }

    const provider = getStreamingProvider();
    await provider.startStream(stream.providerStreamId);
    const playbackUrl = await provider.getPlaybackUrl(stream.providerStreamId);

    const updated = await prisma.liveStream.update({
      where: { id },
      data: { status: "LIVE", actualStart: new Date(), playbackUrl },
    });

    return Response.json({ stream: updated });
  } catch (error) {
    return guardErrorResponse(error);
  }
}
