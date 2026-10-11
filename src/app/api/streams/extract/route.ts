import { NextRequest, NextResponse } from "next/server";
import {
  extractStream,
  extractFacebookStream,
  extractYouTubeStream,
} from "@/lib/utils/stream-extractor";

export const dynamic = "force-dynamic";

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
    } else {
      extracted = extractStream(url);
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
  } else {
    extracted = extractStream(url);
  }

  return NextResponse.json({
    success: true,
    stream: extracted,
  });
}
