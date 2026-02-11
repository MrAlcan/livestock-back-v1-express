import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../cache/redis.service';
import { Logger } from '../logging/logger.service';

export interface ComponentHealth {
  status: 'healthy' | 'unhealthy';
  responseTimeMs: number;
  error?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  components: {
    database: ComponentHealth;
    redis: ComponentHealth;
  };
}

export class HealthCheckService {
  private readonly logger: Logger;
  private readonly startTime: Date;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    this.logger = new Logger('HealthCheckService');
    this.startTime = new Date();
  }

  async check(): Promise<HealthStatus> {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    let status: HealthStatus['status'] = 'healthy';
    if (database.status === 'unhealthy' && redis.status === 'unhealthy') {
      status = 'unhealthy';
    } else if (database.status === 'unhealthy' || redis.status === 'unhealthy') {
      status = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date(),
      uptime: Date.now() - this.startTime.getTime(),
      components: {
        database,
        redis,
      },
    };

    if (status !== 'healthy') {
      this.logger.warn('Health check returned non-healthy status', {
        status,
        database: database.status,
        redis: redis.status,
      });
    }

    return healthStatus;
  }

  private async checkDatabase(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      const healthy = await this.prisma.isHealthy();
      const responseTimeMs = Date.now() - start;

      return {
        status: healthy ? 'healthy' : 'unhealthy',
        responseTimeMs,
        error: healthy ? undefined : 'Database query failed',
      };
    } catch (error) {
      const responseTimeMs = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'unhealthy',
        responseTimeMs,
        error: errorMessage,
      };
    }
  }

  private async checkRedis(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      const pong = await this.redis.ping();
      const responseTimeMs = Date.now() - start;

      return {
        status: pong ? 'healthy' : 'unhealthy',
        responseTimeMs,
        error: pong ? undefined : 'Redis ping failed',
      };
    } catch (error) {
      const responseTimeMs = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'unhealthy',
        responseTimeMs,
        error: errorMessage,
      };
    }
  }
}
