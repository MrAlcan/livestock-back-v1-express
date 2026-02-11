import { ICacheService } from '../../application/shared/ports/ICacheService';
import { RedisService } from './redis.service';
import { Logger } from '../logging/logger.service';

export class CacheAdapter implements ICacheService {
  private readonly logger: Logger;

  constructor(private readonly redis: RedisService) {
    this.logger = new Logger('CacheAdapter');
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.redis.get<T>(key);
    } catch (error) {
      this.logger.error(`Cache get failed for key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      await this.redis.set(key, value, ttlSeconds);
    } catch (error) {
      this.logger.error(`Cache set failed for key: ${key}`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.delete(key);
    } catch (error) {
      this.logger.error(`Cache delete failed for key: ${key}`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      this.logger.error(`Cache exists check failed for key: ${key}`, error);
      return false;
    }
  }

  async clear(pattern?: string): Promise<void> {
    try {
      const matchPattern = pattern ?? '*';
      await this.redis.invalidate(matchPattern);
      this.logger.debug(`Cache cleared for pattern: ${matchPattern}`);
    } catch (error) {
      this.logger.error(`Cache clear failed for pattern: ${pattern}`, error);
    }
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      this.logger.debug(`Cache hit for key: ${key}`);
      return cached;
    }

    this.logger.debug(`Cache miss for key: ${key}`);
    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }
}
