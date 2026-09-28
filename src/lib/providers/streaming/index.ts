import { StreamingProvider } from "./types";
import { mockStreamingProvider } from "./mock-provider";

export * from "./types";

/**
 * Returns the configured StreamingProvider.
 *
 * STREAMING_PROVIDER=mock (default) — in-memory, works with zero setup.
 * STREAMING_PROVIDER=mux | cloudflare | ... — add a case + a new file
 * implementing StreamingProvider; nothing else in the app needs to change.
 */
export function getStreamingProvider(): StreamingProvider {
  const provider = process.env.STREAMING_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
      return mockStreamingProvider;
    // case "mux":
    //   return new MuxStreamingProvider({
    //     tokenId: process.env.STREAMING_API_KEY!,
    //     tokenSecret: process.env.STREAMING_API_SECRET!,
    //   });
    default:
      throw new Error(
        `Unknown STREAMING_PROVIDER "${provider}". Add an implementation in src/lib/providers/streaming/ and register it here.`
      );
  }
}
