import { Router } from 'express';
import { createAuthRoutes } from './auth.routes';
import { createAnimalRoutes } from './animals.routes';
import { createEventRoutes } from './events.routes';
import { createHealthRoutes } from './health.routes';
import { createLotRoutes } from './lots.routes';
import { createReproductionRoutes } from './reproduction.routes';
import { createSenasagRoutes } from './senasag.routes';
import { createFinanceRoutes } from './finance.routes';
import { createAdminRoutes } from './admin.routes';

export interface RouteControllers {
  auth: {
    authController: any;
    userController: any;
    roleController: any;
    permissionController: any;
    auditController: any;
  };
  animals: {
    animalController: any;
    breedController: any;
    genealogyController: any;
  };
  events: {
    eventController: any;
  };
  health: {
    productController: any;
    healthTaskController: any;
    rationController: any;
  };
  lots: {
    lotController: any;
    paddockController: any;
  };
  reproduction: {
    reproductionController: any;
  };
  senasag: {
    gmaController: any;
    documentController: any;
  };
  finance: {
    movementController: any;
    thirdPartyController: any;
    categoryController: any;
  };
  admin: {
    syncController: any;
  };
}

export function createV1Routes(controllers: RouteControllers, auth: any): Router {
  const router = Router();

  router.use(
    '/auth',
    createAuthRoutes(
      controllers.auth.authController,
      controllers.auth.userController,
      controllers.auth.roleController,
      controllers.auth.permissionController,
      controllers.auth.auditController,
      auth,
    ),
  );

  router.use(
    '/animals',
    createAnimalRoutes(
      controllers.animals.animalController,
      controllers.animals.breedController,
      controllers.animals.genealogyController,
      auth,
    ),
  );

  router.use(
    '/events',
    createEventRoutes(
      controllers.events.eventController,
      auth,
    ),
  );

  router.use(
    '/health',
    createHealthRoutes(
      controllers.health.productController,
      controllers.health.healthTaskController,
      controllers.health.rationController,
      auth,
    ),
  );

  router.use(
    '/lots',
    createLotRoutes(
      controllers.lots.lotController,
      controllers.lots.paddockController,
      auth,
    ),
  );

  router.use(
    '/reproduction',
    createReproductionRoutes(
      controllers.reproduction.reproductionController,
      auth,
    ),
  );

  router.use(
    '/senasag',
    createSenasagRoutes(
      controllers.senasag.gmaController,
      controllers.senasag.documentController,
      auth,
    ),
  );

  router.use(
    '/finance',
    createFinanceRoutes(
      controllers.finance.movementController,
      controllers.finance.thirdPartyController,
      controllers.finance.categoryController,
      auth,
    ),
  );

  router.use(
    '/admin',
    createAdminRoutes(
      controllers.admin.syncController,
      auth,
    ),
  );

  return router;
}
