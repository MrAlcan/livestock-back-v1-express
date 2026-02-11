import { createApp, AppDependencies } from './app';
import { Logger } from '../infrastructure/logging/logger.service';

const logger = new Logger('Server');

export function startServer(deps: AppDependencies, port: number = 3000): void {
  const app = createApp(deps);

  const server = app.listen(port, () => {
    logger.info(`Servidor SGG iniciado en puerto ${port}`);
    logger.info(`Swagger docs: http://localhost:${port}/api/docs`);
    logger.info(`Health check: http://localhost:${port}/api/health`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
}
