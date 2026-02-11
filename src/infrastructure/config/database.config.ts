import { z } from 'zod';

const DatabaseConfigSchema = z.object({
  url: z.string(),
  shadowUrl: z.string().optional(),
  poolSize: z.number().min(1).max(100).default(10),
  connectionTimeout: z.number().default(10000),
  queryTimeout: z.number().default(60000),
  logQueries: z.boolean().default(false),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

export function getDatabaseConfig(): DatabaseConfig {
  return DatabaseConfigSchema.parse({
    url: process.env.DATABASE_URL,
    shadowUrl: process.env.SHADOW_DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '60000'),
    logQueries: process.env.DB_LOG_QUERIES === 'true',
  });
}
