import { z } from 'zod';

const AppConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().default(3000),
  corsOrigins: z.array(z.string()).default(['http://localhost:3000']),
  apiPrefix: z.string().default('/api/v1'),
  rateLimitWindowMs: z.number().default(15 * 60 * 1000),
  rateLimitMax: z.number().default(100),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

export function getAppConfig(): AppConfig {
  return AppConfigSchema.parse({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000'),
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000'],
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000)),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  });
}
