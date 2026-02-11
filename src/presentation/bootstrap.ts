import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { startServer } from './server';
import { Logger } from '../infrastructure/logging/logger.service';
import { createDependencies } from './dependencies';

dotenv.config();

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    logger.info('🚀 Iniciando aplicación SGG...');

    const prisma = new PrismaClient({
      log: process.env.DATABASE_LOG_QUERIES === 'true' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6380'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'sgg:',
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('Could not connect to Redis after 3 attempts');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
    });

    try {
      await prisma.$connect();
      logger.info('✓ Conectado a PostgreSQL');
    } catch (error) {
      logger.error('❌ Error conectando a PostgreSQL:', error);
      throw error;
    }

    try {
      await redis.ping();
      logger.info('✓ Conectado a Redis');
    } catch (error) {
      logger.warn('⚠️  No se pudo conectar a Redis (continuando sin cache)');
    }

    // Create all dependencies (repositories, use cases, controllers)
    logger.info('📦 Inicializando dependencias...');
    const dependencies = createDependencies(prisma, redis);
    logger.info('✓ Dependencias inicializadas');

    const port = parseInt(process.env.PORT || '3000');
    startServer(dependencies, port);

    logger.info('🎉 Servidor iniciado exitosamente');
    logger.info(`📚 Swagger: http://localhost:${port}/api/docs`);
    logger.info(`💚 Health: http://localhost:${port}/api/health`);

    const shutdown = async () => {
      logger.info('Cerrando aplicación...');
      await prisma.$disconnect();
      await redis.quit();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('❌ Error fatal al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Fatal error during bootstrap:', error);
  process.exit(1);
});
