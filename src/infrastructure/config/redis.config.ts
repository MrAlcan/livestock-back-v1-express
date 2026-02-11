import { z } from 'zod';

const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(6379),
  password: z.string().optional(),
  db: z.number().default(0),
  keyPrefix: z.string().default('sgg:'),
});

export type RedisConfig = z.infer<typeof RedisConfigSchema>;

export function getRedisConfig(): RedisConfig {
  return RedisConfigSchema.parse({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'sgg:',
  });
}
