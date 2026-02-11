import { Router } from 'express';
import { validate, validateQuery, validateParams, rbac } from '../../middlewares';
import {
  recordFinancialMovementSchema,
  markAsPaymentSchema,
  financialFiltersSchema,
  createThirdPartySchema,
  updateThirdPartySchema,
  thirdPartyFiltersSchema,
  createFinancialCategorySchema,
  profitCalculationSchema,
} from '../../schemas/finance.schema';
import { uuidParamSchema } from '../../schemas/common.schema';

export function createFinanceRoutes(
  movementController: any,
  thirdPartyController: any,
  categoryController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Financial Movements ───────────────────────────────────────────

  router.post('/movements', auth, validate(recordFinancialMovementSchema), movementController.recordMovement);
  router.patch('/movements/:id/approve', auth, rbac(['PROPIETARIO']), movementController.approveMovement);
  router.patch('/movements/:id/payment', auth, validate(markAsPaymentSchema), movementController.markAsPayment);
  router.patch('/movements/:id/cancel', auth, rbac(['PROPIETARIO']), movementController.cancelMovement);
  router.get('/movements', auth, validateQuery(financialFiltersSchema), movementController.listMovements);
  router.get('/movements/overdue', auth, movementController.getOverduePayments);
  router.get('/movements/:id', auth, validateParams(uuidParamSchema), movementController.getMovementDetails);

  // ─── Reports ───────────────────────────────────────────────────────

  router.get('/reports/profit', auth, rbac(['PROPIETARIO', 'ADMINISTRATIVO']), validateQuery(profitCalculationSchema), movementController.calculateProfit);
  router.get('/reports/lot-profitability/:lotId', auth, rbac(['PROPIETARIO', 'ADMINISTRATIVO']), movementController.calculateLotProfitability);

  // ─── Third Parties ─────────────────────────────────────────────────

  router.post('/third-parties', auth, validate(createThirdPartySchema), thirdPartyController.createThirdParty);
  router.put('/third-parties/:id', auth, validate(updateThirdPartySchema), thirdPartyController.updateThirdParty);
  router.get('/third-parties', auth, validateQuery(thirdPartyFiltersSchema), thirdPartyController.listThirdParties);
  router.get('/third-parties/:id', auth, validateParams(uuidParamSchema), thirdPartyController.getThirdPartyDetails);

  // ─── Categories ────────────────────────────────────────────────────

  router.post('/categories', auth, rbac(['PROPIETARIO', 'ADMINISTRATIVO']), validate(createFinancialCategorySchema), categoryController.createCategory);
  router.get('/categories', auth, categoryController.listCategories);

  return router;
}
