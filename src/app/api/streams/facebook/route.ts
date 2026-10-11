import { NextResponse } from "next/server";
import {
  extractFacebookStream,
  TBC_DEFAULT_FACEBOOK_LIVE_URL,
} from "@/lib/utils/stream-extractor";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if there is an active live stream in the database configured with Facebook
    const activeStream = await prisma.liveStream.findFirst({
      where: {
        status: "LIVE",
        OR: [
          { provider: "facebook" },
          { playbackUrl: { contains: "facebook.com" } },
        ],
      },
      orderBy: { actualStart: "desc" },
    });

    const streamUrl = activeStream?.playbackUrl || TBC_DEFAULT_FACEBOOK_LIVE_URL;
    const extracted = extractFacebookStream(streamUrl);

    return NextResponse.json({
      success: true,
      isLive: !!activeStream,
      stream: {
        ...extracted,
        title: activeStream?.title || "Sunday Phronesis & Doxa Service",
        description: activeStream?.description || "Live from The Brook Church Sanctuary, Calabar.",
        scheduledStart: activeStream?.scheduledStart,
        actualStart: activeStream?.actualStart,
        viewerCount: activeStream?.viewerCount || 342,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch Facebook live stream." },
      { status: 500 }
    );
  }
}
