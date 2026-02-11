import { Router } from 'express';
import { validate, validateQuery, validateParams, rbac } from '../../middlewares';
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
  recordInventoryMovementSchema,
  createHealthTaskSchema,
  updateHealthTaskSchema,
  taskFiltersSchema,
  createRationSchema,
  updateRationSchema,
  addRationIngredientSchema,
  assignRationToLotSchema,
} from '../../schemas/health.schema';
import { uuidParamSchema } from '../../schemas/common.schema';

export function createHealthRoutes(
  productController: any,
  healthTaskController: any,
  rationController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Products ──────────────────────────────────────────────────────

  router.post('/products', auth, rbac(['PROPIETARIO', 'TECNICO']), validate(createProductSchema), productController.createProduct);
  router.put('/products/:id', auth, rbac(['PROPIETARIO', 'TECNICO']), validate(updateProductSchema), productController.updateProduct);
  router.patch('/products/:id/deactivate', auth, rbac(['PROPIETARIO']), productController.deactivateProduct);
  router.get('/products', auth, validateQuery(productFiltersSchema), productController.listProducts);
  router.get('/products/low-stock', auth, productController.getLowStockProducts);
  router.get('/products/:id', auth, validateParams(uuidParamSchema), productController.getProductDetails);
  router.get('/products/:id/stock', auth, productController.checkStock);
  router.get('/products/:productId/withdrawal/:animalId', auth, productController.checkWithdrawalPeriod);
  router.post('/products/inventory', auth, validate(recordInventoryMovementSchema), productController.recordInventoryMovement);

  // ─── Health Tasks ──────────────────────────────────────────────────

  router.post('/tasks', auth, validate(createHealthTaskSchema), healthTaskController.createTask);
  router.put('/tasks/:id', auth, validate(updateHealthTaskSchema), healthTaskController.updateTask);
  router.patch('/tasks/:id/complete', auth, healthTaskController.completeTask);
  router.patch('/tasks/:id/cancel', auth, healthTaskController.cancelTask);
  router.get('/tasks', auth, validateQuery(taskFiltersSchema), healthTaskController.listTasks);
  router.get('/tasks/overdue', auth, healthTaskController.getOverdueTasks);
  router.get('/tasks/:id', auth, validateParams(uuidParamSchema), healthTaskController.getTaskDetails);

  // ─── Rations ───────────────────────────────────────────────────────

  router.post('/rations', auth, rbac(['PROPIETARIO', 'TECNICO']), validate(createRationSchema), rationController.createRation);
  router.put('/rations/:id', auth, rbac(['PROPIETARIO', 'TECNICO']), validate(updateRationSchema), rationController.updateRation);
  router.get('/rations', auth, rationController.listRations);
  router.get('/rations/:id', auth, validateParams(uuidParamSchema), rationController.getRationDetails);
  router.post('/rations/:id/ingredients', auth, validate(addRationIngredientSchema), rationController.addIngredient);
  router.post('/rations/assign-lot', auth, validate(assignRationToLotSchema), rationController.assignToLot);

  return router;
}
