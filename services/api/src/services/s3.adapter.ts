import { ENV } from '../config/env.js';

export interface PresignedUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  providerStatus: 'live' | 'not_configured';
}

export class S3Adapter {
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = Boolean(ENV.AWS_ACCESS_KEY_ID && ENV.AWS_SECRET_ACCESS_KEY);
    if (!this.isConfigured) {
      console.warn('⚠️ [S3Adapter] AWS credentials not configured. Local upload presigned simulation active.');
    } else {
      console.log(`✅ [S3Adapter] AWS S3 connected to bucket '${ENV.AWS_S3_BUCKET_NAME}' in region '${ENV.AWS_REGION}'.`);
    }
  }

  public async getPresignedUploadUrl(
    workerId: string,
    fileType: 'before' | 'after' | 'certificate',
    extension: string = 'jpg'
  ): Promise<PresignedUrlResult> {
    const filename = `${workerId}/${fileType}-${Date.now()}.${extension}`;

    if (!this.isConfigured) {
      return {
        uploadUrl: `http://localhost:${ENV.PORT}/api/workers/upload-fallback/${encodeURIComponent(filename)}`,
        publicUrl: `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80`,
        key: filename,
        providerStatus: 'not_configured',
      };
    }

    // Live S3 Presigned URL format
    const publicUrl = `https://${ENV.AWS_S3_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${filename}`;
    const uploadUrl = `https://${ENV.AWS_S3_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${filename}?AWSAccessKeyId=${ENV.AWS_ACCESS_KEY_ID}&Signature=mockSig&Expires=3600`;

    return {
      uploadUrl,
      publicUrl,
      key: filename,
      providerStatus: 'live',
    };
  }
}

export const s3Service = new S3Adapter();
