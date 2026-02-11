import { Router } from 'express';
import { validate, validateQuery, rbac } from '../../middlewares';
import {
  initiateSyncSchema,
  applySyncChangesSchema,
  resolveConflictSchema,
  syncHistoryFiltersSchema,
} from '../../schemas/sync.schema';

export function createAdminRoutes(
  syncController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Sync operations (PROPIETARIO only) ────────────────────────────

  router.post('/sync/initiate', auth, rbac(['PROPIETARIO']), validate(initiateSyncSchema), syncController.initiateSync);
  router.post('/sync/apply', auth, rbac(['PROPIETARIO']), validate(applySyncChangesSchema), syncController.applySyncChanges);
  router.post('/sync/conflicts/:id/resolve', auth, rbac(['PROPIETARIO']), validate(resolveConflictSchema), syncController.resolveConflict);
  router.get('/sync/status', auth, rbac(['PROPIETARIO']), syncController.getSyncStatus);
  router.get('/sync/history', auth, rbac(['PROPIETARIO']), validateQuery(syncHistoryFiltersSchema), syncController.getSyncHistory);
  router.get('/sync/conflicts', auth, rbac(['PROPIETARIO']), syncController.listUnresolvedConflicts);

  return router;
}
