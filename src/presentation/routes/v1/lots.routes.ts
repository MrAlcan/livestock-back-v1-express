import { Router } from 'express';
import { validate, validateQuery, validateParams, rbac } from '../../middlewares';
import {
  createLotSchema,
  lotFiltersSchema,
  createPaddockSchema,
  updatePaddockSchema,
  paddockFiltersSchema,
  updatePaddockConditionSchema,
} from '../../schemas/lot.schema';
import { uuidParamSchema } from '../../schemas/common.schema';

export function createLotRoutes(
  lotController: any,
  paddockController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Lots ──────────────────────────────────────────────────────────

  router.post('/', auth, validate(createLotSchema), lotController.createLot);
  router.get('/', auth, validateQuery(lotFiltersSchema), lotController.listLots);
  router.get('/active', auth, lotController.listActiveLotsForFarm);
  router.patch('/:id/close', auth, rbac(['PROPIETARIO', 'CAPATAZ']), lotController.closeLot);
  router.patch('/:id/average-weight', auth, lotController.updateLotAverageWeight);
  router.get('/:id/target-check', auth, lotController.checkLotTargetWeight);

  // ─── Paddocks ──────────────────────────────────────────────────────

  router.post('/paddocks', auth, validate(createPaddockSchema), paddockController.createPaddock);
  router.put('/paddocks/:id', auth, validate(updatePaddockSchema), paddockController.updatePaddock);
  router.delete('/paddocks/:id', auth, rbac(['PROPIETARIO']), paddockController.deletePaddock);
  router.get('/paddocks', auth, validateQuery(paddockFiltersSchema), paddockController.listPaddocks);
  router.get('/paddocks/:id', auth, validateParams(uuidParamSchema), paddockController.getPaddockDetails);
  router.get('/paddocks/:id/capacity', auth, paddockController.checkCapacity);
  router.patch('/paddocks/:id/condition', auth, validate(updatePaddockConditionSchema), paddockController.updateCondition);

  // ─── Lot by ID (must be after specific routes) ────────────────────

  router.get('/:id', auth, validateParams(uuidParamSchema), lotController.getLotDetails);

  return router;
}
