import express, { Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import {
  createCorsMiddleware,
  requestLoggerMiddleware,
  globalRateLimiter,
  errorHandlerMiddleware,
  createAuthMiddleware,
} from './middlewares';
import { createV1Routes, RouteControllers } from './routes/v1';
import { swaggerSpec } from './swagger/swagger.config';
import { IJwtService } from '../application/shared/ports/IJwtService';

export interface AppDependencies {
  jwtService: IJwtService;
  controllers: RouteControllers;
}

export function createApp(deps: AppDependencies): Application {
  const app = express();

  // Security
  app.use(helmet());
  app.use(createCorsMiddleware());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(requestLoggerMiddleware);

  // Rate limiting
  app.use(globalRateLimiter);

  // Swagger docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Swagger JSON spec
  app.get('/api/docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth middleware factory
  const auth = createAuthMiddleware(deps.jwtService);

  // API v1 routes
  app.use('/api/v1', createV1Routes(deps.controllers, auth));

  // Error handling (must be last)
  app.use(errorHandlerMiddleware);

  return app;
}
