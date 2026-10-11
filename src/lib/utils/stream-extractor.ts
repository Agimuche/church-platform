/**
 * Utility for parsing and extracting live streams and videos from Facebook, YouTube,
 * and direct native HLS/MP4 streams.
 */

export type StreamPlatform = "facebook" | "youtube" | "native" | "unknown";

export interface ExtractedStream {
  platform: StreamPlatform;
  isValid: boolean;
  originalUrl: string;
  canonicalUrl: string;
  embedUrl: string;
  videoId?: string;
  channelId?: string;
  pageUsername?: string;
  title?: string;
  thumbnailUrl?: string;
  isLiveLikely: boolean;
  platformName: string;
  directWatchUrl: string;
  hasSpecificVideoId?: boolean;
  fallbackVideoId?: string;
  error?: string;
}

export const TBC_DEFAULT_YOUTUBE_CHANNEL_ID = "UCJvBuTWCGPOYzucq8QhPYwQ";
export const TBC_DEFAULT_YOUTUBE_HANDLE = "@thebrookchurchng";
export const TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID = "h6XWU2GNa6E";
export const TBC_DEFAULT_CURRENT_SERVICE_TITLE = "ZOE LIFE CONFERENCE DAY 2 | LIVE NOW";
export const TBC_DEFAULT_YOUTUBE_LIVE_URL = "https://www.youtube.com/@thebrookchurchng/live";
export const TBC_DEFAULT_YOUTUBE_LIVE_EMBED = `https://www.youtube.com/embed/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}?autoplay=1&mute=0&rel=0&enablejsapi=1`;

export const SERVICE_BROADCAST_PRESETS = [
  {
    id: "h6XWU2GNa6E",
    title: "ZOE LIFE CONFERENCE DAY 2 | LIVE NOW",
    label: "🔴 Zoe Conf Day 2 (Live Now)",
  },
  {
    id: "FIiP-wbDK5k",
    title: "ZOE LIFE CONFERENCE DAY 1 | LIVE NOW",
    label: "Zoe Conf Day 1",
  },
  {
    id: "Yb4l4xWGTaM",
    title: "WORDSHOP — Pneumatology Study",
    label: "Wordshop",
  },
  {
    id: "M-20iRqFSX4",
    title: "DOXA — Sunday 2nd Service",
    label: "Doxa Service",
  },
  {
    id: "P3pmBIPG19c",
    title: "PHRONESIS — Sunday 1st Service",
    label: "Phronesis Service",
  },
];

export const TBC_DEFAULT_FACEBOOK_PAGE = "thebrookchurchng";
export const TBC_DEFAULT_FACEBOOK_PAGE_URL = "https://www.facebook.com/thebrookchurchng/";
export const TBC_DEFAULT_FACEBOOK_LIVE_URL = "https://www.facebook.com/thebrookchurchng/live_videos/";
export const TBC_DEFAULT_FACEBOOK_LIVE_EMBED = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
  TBC_DEFAULT_FACEBOOK_LIVE_URL
)}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

/**
 * Extracts YouTube stream details from any YouTube URL, video ID, or channel.
 * Automatically falls back to the current active sanctuary broadcast when a general channel URL is provided.
 */
export function extractYouTubeStream(input: string): ExtractedStream {
  const trimmed = (input || "").trim();
  if (!trimmed) {
    return {
      platform: "youtube",
      isValid: true,
      originalUrl: input,
      canonicalUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      embedUrl: TBC_DEFAULT_YOUTUBE_LIVE_EMBED,
      videoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
      channelId: TBC_DEFAULT_YOUTUBE_CHANNEL_ID,
      isLiveLikely: true,
      hasSpecificVideoId: true,
      platformName: "YouTube Live",
      directWatchUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}/maxresdefault.jpg`,
    };
  }

  // Check if it's already an embed URL
  const embedMatch = trimmed.match(
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i
  );
  if (embedMatch) {
    const videoId = embedMatch[1];
    return {
      platform: "youtube",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&enablejsapi=1`,
      videoId,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "YouTube Live",
      directWatchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  // Check for channel live_stream embed
  const liveChannelMatch = trimmed.match(
    /(?:youtube\.com\/embed\/live_stream\?channel=)([a-zA-Z0-9_-]+)/i
  );
  if (liveChannelMatch) {
    const channelId = liveChannelMatch[1];
    return {
      platform: "youtube",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      embedUrl: `https://www.youtube.com/embed/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}?autoplay=1&mute=0&rel=0&enablejsapi=1`,
      channelId,
      videoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "YouTube Live",
      directWatchUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}/maxresdefault.jpg`,
    };
  }

  // Direct 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      platform: "youtube",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      embedUrl: `https://www.youtube.com/embed/${trimmed}?autoplay=1&mute=0&rel=0&enablejsapi=1`,
      videoId: trimmed,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "YouTube Live",
      directWatchUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      thumbnailUrl: `https://img.youtube.com/vi/${trimmed}/maxresdefault.jpg`,
    };
  }

  // Standard video URL patterns (watch?v=, youtu.be/, live/, shorts/)
  const standardVideoMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|v\/|live\/|shorts\/))([a-zA-Z0-9_-]{11})/i
  );
  if (standardVideoMatch) {
    const videoId = standardVideoMatch[1];
    return {
      platform: "youtube",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&enablejsapi=1`,
      videoId,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "YouTube Live",
      directWatchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  // Channel ID URL (youtube.com/channel/UC...)
  const channelIdMatch = trimmed.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/i);
  if (channelIdMatch) {
    const channelId = channelIdMatch[1];
    return {
      platform: "youtube",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      embedUrl: `https://www.youtube.com/embed/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}?autoplay=1&mute=0&rel=0&enablejsapi=1`,
      channelId,
      videoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "YouTube Live",
      directWatchUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}/maxresdefault.jpg`,
    };
  }

  // Channel handle URL (youtube.com/@thebrookchurchng or general brook search)
  if (trimmed.includes("@thebrookchurchng") || trimmed.includes("thebrookchurch") || trimmed.includes("/live")) {
    return {
      platform: "youtube",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      embedUrl: TBC_DEFAULT_YOUTUBE_LIVE_EMBED,
      videoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
      channelId: TBC_DEFAULT_YOUTUBE_CHANNEL_ID,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "YouTube Live",
      directWatchUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}/maxresdefault.jpg`,
    };
  }

  // Fallback for general YouTube link
  return {
    platform: "youtube",
    isValid: true,
    originalUrl: trimmed,
    canonicalUrl: `https://www.youtube.com/watch?v=${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}`,
    embedUrl: TBC_DEFAULT_YOUTUBE_LIVE_EMBED,
    videoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
    channelId: TBC_DEFAULT_YOUTUBE_CHANNEL_ID,
    hasSpecificVideoId: true,
    isLiveLikely: true,
    platformName: "YouTube Live",
    directWatchUrl: trimmed,
    thumbnailUrl: `https://i.ytimg.com/vi/${TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID}/maxresdefault.jpg`,
  };
}

/**
 * Normalizes Facebook URLs by replacing mobile subdomains and removing tracking parameters.
 */
function normalizeFacebookUrl(rawUrl: string): string {
  try {
    let clean = rawUrl
      .trim()
      .replace(/^https?:\/\/(?:web|m|mobile|mbasic)\.facebook\.com/i, "https://www.facebook.com");

    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = "https://" + clean;
    }

    const parsed = new URL(clean);
    // Remove transient tracking query parameters
    const paramsToDrop = [
      "mibextid",
      "sfnsn",
      "ref",
      "notif_t",
      "notif_id",
      "fbclid",
      "paipv",
      "rdid",
      "_rdr",
      "locale",
    ];
    paramsToDrop.forEach((p) => parsed.searchParams.delete(p));

    return parsed.toString();
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Extracts Facebook live stream or video details from any Facebook URL, video ID, or page link.
 * Works seamlessly with:
 * - https://web.facebook.com/thebrookchurchng/live_videos/
 * - https://www.facebook.com/thebrookchurchng/live_videos/
 * - https://www.facebook.com/watch/live/?v=123456789
 * - https://www.facebook.com/watch/?v=123456789
 * - https://www.facebook.com/thebrookchurchng/videos/123456789/
 * - https://fb.watch/xyz123/
 * - Facebook Embedded Player plugin URLs
 * - Numeric Video IDs
 */
export function extractFacebookStream(input: string): ExtractedStream {
  const trimmed = (input || "").trim();
  if (!trimmed) {
    return {
      platform: "facebook",
      isValid: true,
      originalUrl: input,
      canonicalUrl: TBC_DEFAULT_FACEBOOK_LIVE_URL,
      embedUrl: TBC_DEFAULT_FACEBOOK_LIVE_EMBED,
      pageUsername: TBC_DEFAULT_FACEBOOK_PAGE,
      isLiveLikely: true,
      hasSpecificVideoId: false,
      fallbackVideoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
      platformName: "Facebook Live",
      directWatchUrl: TBC_DEFAULT_FACEBOOK_LIVE_URL,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  // Case 1: Already a Facebook plugins/video.php embed URL
  if (trimmed.includes("facebook.com/plugins/video.php")) {
    try {
      const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      const href = parsed.searchParams.get("href");
      if (href) {
        return extractFacebookStream(href);
      }
    } catch {
      // proceed with raw embed
    }
    return {
      platform: "facebook",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: TBC_DEFAULT_FACEBOOK_LIVE_URL,
      embedUrl: trimmed,
      pageUsername: TBC_DEFAULT_FACEBOOK_PAGE,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "Facebook Live",
      directWatchUrl: TBC_DEFAULT_FACEBOOK_LIVE_URL,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  // Case 2: Pure numeric video ID (e.g. 10158493029482718)
  if (/^\d{8,22}$/.test(trimmed)) {
    const videoId = trimmed;
    const canonical = `https://www.facebook.com/watch/?v=${videoId}`;
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      canonical
    )}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

    return {
      platform: "facebook",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: canonical,
      embedUrl,
      videoId,
      hasSpecificVideoId: true,
      pageUsername: TBC_DEFAULT_FACEBOOK_PAGE,
      isLiveLikely: true,
      platformName: "Facebook Live",
      directWatchUrl: canonical,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  const normalized = normalizeFacebookUrl(trimmed);

  // Case 3: Facebook Live section of a Page (e.g. /thebrookchurchng/live_videos/)
  const liveVideosMatch = normalized.match(
    /facebook\.com\/([a-zA-Z0-9._-]+)\/live_videos\/?/i
  );
  if (liveVideosMatch) {
    const page = liveVideosMatch[1];
    const canonical = `https://www.facebook.com/${page}/live_videos/`;
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      canonical
    )}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

    return {
      platform: "facebook",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: canonical,
      embedUrl,
      pageUsername: page,
      hasSpecificVideoId: false,
      fallbackVideoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
      isLiveLikely: true,
      platformName: "Facebook Live",
      directWatchUrl: canonical,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  // Case 4: Facebook Watch Live or Watch video URL (e.g. /watch/live/?v=123456 or /watch/?v=123456)
  const watchMatch = normalized.match(
    /facebook\.com\/watch\/(?:live\/)?\?(?:.*&)?v=([0-9]+)/i
  );
  if (watchMatch) {
    const videoId = watchMatch[1];
    const canonical = `https://www.facebook.com/watch/?v=${videoId}`;
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      canonical
    )}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

    return {
      platform: "facebook",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: canonical,
      embedUrl,
      videoId,
      hasSpecificVideoId: true,
      pageUsername: TBC_DEFAULT_FACEBOOK_PAGE,
      isLiveLikely: normalized.includes("/live/"),
      platformName: normalized.includes("/live/") ? "Facebook Live" : "Facebook Video",
      directWatchUrl: canonical,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  // Case 5: Page video URL (e.g. /thebrookchurchng/videos/1234567890/ or /thebrookchurchng/posts/...)
  const pageVideoMatch = normalized.match(
    /facebook\.com\/([a-zA-Z0-9._-]+)\/videos\/([0-9]+)\/?/i
  );
  if (pageVideoMatch) {
    const page = pageVideoMatch[1];
    const videoId = pageVideoMatch[2];
    const canonical = `https://www.facebook.com/${page}/videos/${videoId}/`;
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      canonical
    )}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

    return {
      platform: "facebook",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: canonical,
      embedUrl,
      videoId,
      hasSpecificVideoId: true,
      pageUsername: page,
      isLiveLikely: false,
      platformName: "Facebook Video",
      directWatchUrl: canonical,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  // Case 6: Short link fb.watch/xyz...
  if (normalized.includes("fb.watch/")) {
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      normalized
    )}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

    return {
      platform: "facebook",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: normalized,
      embedUrl,
      hasSpecificVideoId: true,
      isLiveLikely: true,
      platformName: "Facebook Live",
      directWatchUrl: normalized,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  // Case 7: General Page Link (e.g. facebook.com/thebrookchurchng or facebook.com/thebrookchurchng/)
  const pageMatch = normalized.match(/facebook\.com\/([a-zA-Z0-9._-]+)\/?$/i);
  if (pageMatch) {
    const page = pageMatch[1];
    const canonical = `https://www.facebook.com/${page}/live_videos/`;
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      canonical
    )}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

    return {
      platform: "facebook",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: canonical,
      embedUrl,
      pageUsername: page,
      hasSpecificVideoId: false,
      fallbackVideoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
      isLiveLikely: true,
      platformName: "Facebook Live",
      directWatchUrl: canonical,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
    };
  }

  // Fallback for any Facebook URL: construct embed plugin URL
  const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    normalized
  )}&show_text=0&autoplay=1&mute=0&allowfullscreen=true`;

  return {
    platform: "facebook",
    isValid: true,
    originalUrl: trimmed,
    canonicalUrl: normalized,
    embedUrl,
    pageUsername: TBC_DEFAULT_FACEBOOK_PAGE,
    hasSpecificVideoId: false,
    fallbackVideoId: TBC_DEFAULT_CURRENT_SERVICE_YOUTUBE_ID,
    isLiveLikely: true,
    platformName: "Facebook Live",
    directWatchUrl: normalized,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80",
  };
}

/**
 * Universal stream extractor. Detects if input is YouTube, Facebook, or Native stream.
 */
export function extractStream(input: string): ExtractedStream {
  const trimmed = (input || "").trim();
  if (!trimmed) {
    // Default to Facebook Live for The Brook Church if none provided
    return extractFacebookStream("");
  }

  const lower = trimmed.toLowerCase();

  // 1. Check Facebook
  if (
    lower.includes("facebook.com") ||
    lower.includes("fb.watch") ||
    lower.includes("fb.com")
  ) {
    return extractFacebookStream(trimmed);
  }

  // 2. Check YouTube
  if (
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    /^[a-zA-Z0-9_-]{11}$/.test(trimmed)
  ) {
    return extractYouTubeStream(trimmed);
  }

  // 3. Check Native HLS / MP4
  if (
    lower.endsWith(".m3u8") ||
    lower.endsWith(".mp4") ||
    lower.includes("/live/") ||
    lower.startsWith("rtmp://")
  ) {
    return {
      platform: "native",
      isValid: true,
      originalUrl: trimmed,
      canonicalUrl: trimmed,
      embedUrl: trimmed,
      isLiveLikely: true,
      platformName: "Direct Cloud Stream (HLS)",
      directWatchUrl: trimmed,
    };
  }

  // If input looks like a numeric ID (potential Facebook video ID)
  if (/^\d{8,22}$/.test(trimmed)) {
    return extractFacebookStream(trimmed);
  }

  // Default fallback: Try Facebook if it mentions brook, else unknown
  if (lower.includes("brook")) {
    return extractFacebookStream(trimmed);
  }

  return {
    platform: "unknown",
    isValid: false,
    originalUrl: trimmed,
    canonicalUrl: trimmed,
    embedUrl: trimmed,
    isLiveLikely: false,
    platformName: "Custom Stream",
    directWatchUrl: trimmed,
    error: "Unrecognized stream URL format. Please paste a valid Facebook or YouTube link.",
  };
}
