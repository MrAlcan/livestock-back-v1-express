import { IStorageService } from '../../application/shared/ports/IStorageService';
import { Logger } from '../logging/logger.service';

/**
 * S3 Storage Adapter - Placeholder Implementation
 *
 * This adapter implements the IStorageService interface for Amazon S3.
 * It requires @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner to be installed.
 *
 * To enable S3 storage:
 * 1. Install dependencies: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 * 2. Set environment variables: AWS_S3_REGION, AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 * 3. Replace the placeholder methods with actual S3 client calls
 */
export class S3StorageAdapter implements IStorageService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('S3StorageAdapter');
  }

  async upload(_file: Buffer, _path: string, _contentType: string): Promise<string> {
    this.logger.error('S3 storage is not configured');
    throw new Error(
      'S3 not configured. Install @aws-sdk/client-s3 and set AWS environment variables.',
    );
  }

  async download(_path: string): Promise<Buffer> {
    this.logger.error('S3 storage is not configured');
    throw new Error(
      'S3 not configured. Install @aws-sdk/client-s3 and set AWS environment variables.',
    );
  }

  async delete(_path: string): Promise<void> {
    this.logger.error('S3 storage is not configured');
    throw new Error(
      'S3 not configured. Install @aws-sdk/client-s3 and set AWS environment variables.',
    );
  }

  async getSignedUrl(_path: string, _expirationMinutes?: number): Promise<string> {
    this.logger.error('S3 storage is not configured');
    throw new Error(
      'S3 not configured. Install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner and set AWS environment variables.',
    );
  }

  async exists(_path: string): Promise<boolean> {
    this.logger.error('S3 storage is not configured');
    throw new Error(
      'S3 not configured. Install @aws-sdk/client-s3 and set AWS environment variables.',
    );
  }
}
