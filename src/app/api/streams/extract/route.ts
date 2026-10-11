import { NextRequest, NextResponse } from "next/server";
import {
  extractStream,
  extractFacebookStream,
  extractYouTubeStream,
  TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
} from "@/lib/utils/stream-extractor";

export const dynamic = "force-dynamic";

async function resolveCurrentLiveVideoId(): Promise<string> {
  try {
    const res = await fetch("https://www.youtube.com/@thebrookchurchng/streams", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch {
    // Fall back to known default current service ID
  }
  return TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { url, platform } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid URL or stream identifier is required." },
        { status: 400 }
      );
    }

    let extracted;
    if (platform === "facebook") {
      extracted = extractFacebookStream(url);
    } else if (platform === "youtube") {
      extracted = extractYouTubeStream(url);
      if (url.includes("@") || url.includes("/live") || url.includes("/channel/")) {
        const liveId = await resolveCurrentLiveVideoId();
        if (liveId && liveId !== extracted.videoId) {
          extracted = extractYouTubeStream(`https://www.youtube.com/watch?v=${liveId}`);
        }
      }
    } else {
      extracted = extractStream(url);
      if (
        extracted.platform === "youtube" &&
        (url.includes("@") || url.includes("/live") || url.includes("/channel/"))
      ) {
        const liveId = await resolveCurrentLiveVideoId();
        if (liveId) {
          extracted = extractYouTubeStream(`https://www.youtube.com/watch?v=${liveId}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      stream: extracted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to extract stream." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || "";
  const platform = searchParams.get("platform") || "auto";

  let extracted;
  if (platform === "facebook") {
    extracted = extractFacebookStream(url);
  } else if (platform === "youtube") {
    extracted = extractYouTubeStream(url);
    if (!url || url.includes("@") || url.includes("/live") || url.includes("/channel/")) {
      const liveId = await resolveCurrentLiveVideoId();
      if (liveId) {
        extracted = extractYouTubeStream(`https://www.youtube.com/watch?v=${liveId}`);
      }
    }
  } else {
    extracted = extractStream(url);
    if (
      extracted.platform === "youtube" &&
      (!url || url.includes("@") || url.includes("/live") || url.includes("/channel/"))
    ) {
      const liveId = await resolveCurrentLiveVideoId();
      if (liveId) {
        extracted = extractYouTubeStream(`https://www.youtube.com/watch?v=${liveId}`);
      }
    }
  }

  return NextResponse.json({
    success: true,
    stream: extracted,
  });
}
