import { StorageProvider, UploadInput } from "./types";

/**
 * Amazon S3 implementation of StorageProvider.
 *
 * Requires the `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
 * packages (not installed by default, to keep the MVP dependency-light —
 * see rule #24 in the project brief). Install them before switching
 * STORAGE_PROVIDER=s3:
 *
 *   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 *
 * Required environment variables:
 *   AWS_REGION
 *   AWS_ACCESS_KEY_ID
 *   AWS_SECRET_ACCESS_KEY
 *   S3_BUCKET_NAME
 *   S3_PUBLIC_BASE_URL   (e.g. CloudFront domain, for getUrl())
 */
export class S3StorageProvider implements StorageProvider {
  readonly name = "s3";

  constructor(
    private readonly bucket: string,
    private readonly publicBaseUrl: string
  ) {
    if (!bucket) throw new Error("S3StorageProvider requires S3_BUCKET_NAME.");
  }

  async upload(_input: UploadInput): Promise<{ key: string }> {
    throw new Error(
      "S3StorageProvider.upload is not wired up yet. Install @aws-sdk/client-s3 and implement PutObjectCommand here."
    );
  }

  async delete(_key: string): Promise<void> {
    throw new Error(
      "S3StorageProvider.delete is not wired up yet. Install @aws-sdk/client-s3 and implement DeleteObjectCommand here."
    );
  }

  getUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }

  async getSignedUrl(_key: string, _expiresInSeconds = 3600): Promise<string> {
    throw new Error(
      "S3StorageProvider.getSignedUrl is not wired up yet. Install @aws-sdk/s3-request-presigner and implement getSignedUrl(GetObjectCommand) here."
    );
  }
}
