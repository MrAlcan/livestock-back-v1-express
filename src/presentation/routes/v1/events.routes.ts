import { Router } from 'express';
import { validate, validateQuery, validateParams, rbac } from '../../middlewares';
import {
  registerEventBirthSchema,
  registerEventDeathSchema,
  registerEventHealthSchema,
  registerEventMovementSchema,
  registerEventWeighingSchema,
  registerEventReproductionSchema,
  registerEventSaleSchema,
  registerEventPurchaseSchema,
  registerEventWeaningSchema,
  registerEventIdentificationSchema,
  eventFiltersSchema,
} from '../../schemas/event.schema';
import { uuidParamSchema } from '../../schemas/common.schema';

export function createEventRoutes(
  eventController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Event registration ────────────────────────────────────────────

  router.post('/birth', auth, validate(registerEventBirthSchema), eventController.registerBirth);
  router.post('/death', auth, validate(registerEventDeathSchema), eventController.registerDeath);
  router.post('/health', auth, validate(registerEventHealthSchema), eventController.registerHealth);
  router.post('/movement', auth, validate(registerEventMovementSchema), eventController.registerMovement);
  router.post('/weighing', auth, validate(registerEventWeighingSchema), eventController.registerWeighing);
  router.post('/reproduction', auth, validate(registerEventReproductionSchema), eventController.registerReproduction);
  router.post('/sale', auth, validate(registerEventSaleSchema), eventController.registerSale);
  router.post('/purchase', auth, validate(registerEventPurchaseSchema), eventController.registerPurchase);
  router.post('/weaning', auth, validate(registerEventWeaningSchema), eventController.registerWeaning);
  router.post('/identification', auth, validate(registerEventIdentificationSchema), eventController.registerIdentification);
  router.post('/bulk', auth, rbac(['PROPIETARIO', 'TECNICO']), eventController.bulkRegister);

  // ─── Event queries ─────────────────────────────────────────────────

  router.get('/', auth, validateQuery(eventFiltersSchema), eventController.listEventsByFarm);
  router.get('/animal/:animalId', auth, eventController.listEventsByAnimal);
  router.get('/adg/:animalId', auth, eventController.calculateADG);
  router.get('/estimate-birth', auth, eventController.estimateBirthDate);
  router.get('/:id', auth, validateParams(uuidParamSchema), eventController.getEventDetails);

  return router;
}
