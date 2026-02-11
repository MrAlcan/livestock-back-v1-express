import { Router } from 'express';
import { validate, validateQuery } from '../../middlewares';
import {
  registerReproductiveServiceSchema,
  recordDiagnosisSchema,
  recordBirthSchema,
  recordWeaningSchema,
  reproductiveCycleFiltersSchema,
} from '../../schemas/reproduction.schema';

export function createReproductionRoutes(
  reproductionController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Reproductive events ───────────────────────────────────────────

  router.post('/service', auth, validate(registerReproductiveServiceSchema), reproductionController.registerService);
  router.post('/diagnosis', auth, validate(recordDiagnosisSchema), reproductionController.recordDiagnosis);
  router.post('/birth', auth, validate(recordBirthSchema), reproductionController.recordBirth);
  router.post('/weaning', auth, validate(recordWeaningSchema), reproductionController.recordWeaning);

  // ─── Queries ───────────────────────────────────────────────────────

  router.get('/cycles/:femaleId', auth, reproductionController.getCycle);
  router.get('/cycles', auth, validateQuery(reproductiveCycleFiltersSchema), reproductionController.listActiveCycles);
  router.get('/performance/:femaleId', auth, reproductionController.calculatePerformance);
  router.get('/stats', auth, reproductionController.getFarmStats);

  return router;
}
