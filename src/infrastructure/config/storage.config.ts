import { z } from 'zod';

const StorageConfigSchema = z.object({
  provider: z.enum(['local', 's3']).default('local'),
  localPath: z.string().default('./uploads'),
  maxFileSize: z.number().default(10 * 1024 * 1024),
  allowedMimeTypes: z.array(z.string()).default([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]),
  s3Region: z.string().optional(),
  s3BucketName: z.string().optional(),
  s3AccessKey: z.string().optional(),
  s3SecretKey: z.string().optional(),
});

export type StorageConfig = z.infer<typeof StorageConfigSchema>;

export function getStorageConfig(): StorageConfig {
  return StorageConfigSchema.parse({
    provider: process.env.STORAGE_PROVIDER || 'local',
    localPath: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || String(10 * 1024 * 1024)),
    s3Region: process.env.AWS_S3_REGION || undefined,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME || undefined,
    s3AccessKey: process.env.AWS_ACCESS_KEY_ID || undefined,
    s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
  });
}
