import Redis from 'ioredis';
import { Logger } from '../logging/logger.service';
import { getRedisConfig, RedisConfig } from '../config/redis.config';

export class RedisService {
  private readonly client: Redis;
  private readonly logger: Logger;
  private readonly config: RedisConfig;

  constructor() {
    this.logger = new Logger('RedisService');
    this.config = getRedisConfig();

    this.client = new Redis({
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      db: this.config.db,
      keyPrefix: this.config.keyPrefix,
      retryStrategy: (times: number) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.logger.info('Redis connected');
    });

    this.client.on('error', (error: Error) => {
      this.logger.error('Redis error', error);
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
    });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds !== undefined && ttlSeconds > 0) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidate(pattern: string): Promise<void> {
    const prefix = this.config.keyPrefix;
    const stream = this.client.scanStream({
      match: `${prefix}${pattern}`,
      count: 100,
    });

    const pipeline = this.client.pipeline();
    let count = 0;

    return new Promise<void>((resolve, reject) => {
      stream.on('data', (keys: string[]) => {
        for (const key of keys) {
          // Strip prefix since ioredis adds it automatically
          const strippedKey = key.startsWith(prefix) ? key.slice(prefix.length) : key;
          pipeline.del(strippedKey);
          count++;
        }
      });

      stream.on('end', async () => {
        if (count > 0) {
          await pipeline.exec();
          this.logger.debug(`Invalidated ${count} keys matching pattern: ${pattern}`);
        }
        resolve();
      });

      stream.on('error', (error: Error) => {
        this.logger.error('Error invalidating cache keys', error);
        reject(error);
      });
    });
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async increment(key: string, by: number = 1): Promise<number> {
    if (by === 1) {
      return this.client.incr(key);
    }
    return this.client.incrby(key, by);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
    this.logger.info('Redis disconnected');
  }

  getClient(): Redis {
    return this.client;
  }
}
