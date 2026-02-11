import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  DATABASE_URL: z.string(),
  SHADOW_DATABASE_URL: z.string().optional(),
  DB_POOL_SIZE: z.string().default('10'),
  DB_CONNECTION_TIMEOUT: z.string().default('10000'),
  DB_QUERY_TIMEOUT: z.string().default('60000'),
  DB_LOG_QUERIES: z.string().default('false'),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0'),
  REDIS_KEY_PREFIX: z.string().default('sgg:'),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  BCRYPT_ROUNDS: z.string().default('10'),

  ENCRYPTION_KEY: z.string().optional(),

  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().default('587'),
  EMAIL_SECURE: z.string().default('false'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
  UPLOAD_PATH: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.string().default(String(10 * 1024 * 1024)),
  AWS_S3_REGION: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  LOG_LEVEL: z.string().default('info'),
  LOGS_DIR: z.string().default('./logs'),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(): Env {
  return EnvSchema.parse(process.env);
}
