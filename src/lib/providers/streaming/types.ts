/**
 * Abstraction over a live-streaming backend (e.g. Mux, Cloudflare Stream,
 * YouTube Live, Zoom). The rest of the app — frontend and database — only
 * ever talks to this interface, never to a specific vendor's SDK. Swapping
 * providers means writing one new class and changing an environment
 * variable; nothing else in the codebase changes.
 */

export interface CreateStreamInput {
  title: string;
  description?: string;
}

export interface StreamHandle {
  /** Provider-side identifier, stored on LiveStream.providerStreamId */
  providerStreamId: string;
  /** RTMP/ingest URL the broadcaster's encoder pushes to, if applicable */
  ingestUrl?: string;
  /** Stream key/secret for the ingest URL, if applicable */
  streamKey?: string;
}

export type ProviderStreamStatus = "idle" | "live" | "ended" | "error";

export interface StreamStatusResult {
  status: ProviderStreamStatus;
  startedAt?: Date;
  endedAt?: Date;
}

export interface StreamAnalytics {
  currentViewers: number;
  peakViewers: number;
  totalViews: number;
}

export interface StreamingProvider {
  readonly name: string;

  createStream(input: CreateStreamInput): Promise<StreamHandle>;
  startStream(providerStreamId: string): Promise<void>;
  stopStream(providerStreamId: string): Promise<void>;
  getStreamStatus(providerStreamId: string): Promise<StreamStatusResult>;
  getPlaybackUrl(providerStreamId: string): Promise<string>;
  getStreamAnalytics(providerStreamId: string): Promise<StreamAnalytics>;
}
