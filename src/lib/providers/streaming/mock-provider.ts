import {
  CreateStreamInput,
  StreamAnalytics,
  StreamHandle,
  StreamingProvider,
  StreamStatusResult,
} from "./types";

/**
 * In-memory streaming provider for local development and tests. No network
 * calls, no external dependency — the app runs fully offline. Swap
 * STREAMING_PROVIDER=mock for a real vendor once credentials are available.
 */
class MockStreamingProvider implements StreamingProvider {
  readonly name = "mock";

  private streams = new Map<
    string,
    { status: StreamStatusResult["status"]; startedAt?: Date; endedAt?: Date }
  >();

  async createStream(input: CreateStreamInput): Promise<StreamHandle> {
    const id = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.streams.set(id, { status: "idle" });
    return {
      providerStreamId: id,
      ingestUrl: `rtmp://mock.local/live/${id}`,
      streamKey: `mock_key_${id}`,
    };
  }

  async startStream(providerStreamId: string): Promise<void> {
    const s = this.requireStream(providerStreamId);
    s.status = "live";
    s.startedAt = new Date();
  }

  async stopStream(providerStreamId: string): Promise<void> {
    const s = this.requireStream(providerStreamId);
    s.status = "ended";
    s.endedAt = new Date();
  }

  async getStreamStatus(providerStreamId: string): Promise<StreamStatusResult> {
    const s = this.requireStream(providerStreamId);
    return { status: s.status, startedAt: s.startedAt, endedAt: s.endedAt };
  }

  async getPlaybackUrl(providerStreamId: string): Promise<string> {
    this.requireStream(providerStreamId);
    return `/mock-stream/${providerStreamId}/playlist.m3u8`;
  }

  async getStreamAnalytics(providerStreamId: string): Promise<StreamAnalytics> {
    const s = this.requireStream(providerStreamId);
    // Deterministic placeholder numbers — enough for the UI to render real shapes.
    const base = s.status === "live" ? 1 : 0;
    return { currentViewers: base * 12, peakViewers: base * 34, totalViews: base * 58 };
  }

  private requireStream(id: string) {
    const s = this.streams.get(id);
    if (!s) throw new Error(`MockStreamingProvider: unknown stream "${id}"`);
    return s;
  }
}

export const mockStreamingProvider = new MockStreamingProvider();
