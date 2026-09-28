export interface UploadInput {
  key: string; // e.g. "sermons/2026/09/abc123.mp4"
  body: Buffer | Uint8Array;
  contentType: string;
}

export interface StorageProvider {
  readonly name: string;

  upload(input: UploadInput): Promise<{ key: string }>;
  delete(key: string): Promise<void>;
  /** Public URL, if the object is publicly readable */
  getUrl(key: string): string;
  /** Time-limited signed URL for private objects */
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
