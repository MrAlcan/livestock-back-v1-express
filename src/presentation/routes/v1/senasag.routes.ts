import { Router } from 'express';
import { validate, validateQuery, validateParams, rbac } from '../../middlewares';
import {
  createGMASchema,
  approveGMASchema,
  rejectGMASchema,
  markGMAInTransitSchema,
  closeGMASchema,
  addAnimalToGMASchema,
  gmaFiltersSchema,
  createRegulatoryDocumentSchema,
  updateDocumentStatusSchema,
} from '../../schemas/senasag.schema';
import { uuidParamSchema } from '../../schemas/common.schema';

export function createSenasagRoutes(
  gmaController: any,
  documentController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── GMA (Guia de Movimiento Animal) ──────────────────────────────

  router.post('/gma', auth, validate(createGMASchema), gmaController.createGMA);
  router.patch('/gma/:id/approve', auth, rbac(['PROPIETARIO', 'ADMINISTRATIVO']), validate(approveGMASchema), gmaController.approveGMA);
  router.patch('/gma/:id/reject', auth, rbac(['PROPIETARIO', 'ADMINISTRATIVO']), validate(rejectGMASchema), gmaController.rejectGMA);
  router.patch('/gma/:id/transit', auth, validate(markGMAInTransitSchema), gmaController.markInTransit);
  router.patch('/gma/:id/close', auth, validate(closeGMASchema), gmaController.closeGMA);
  router.get('/gma', auth, validateQuery(gmaFiltersSchema), gmaController.listGMAs);
  router.get('/gma/:id', auth, validateParams(uuidParamSchema), gmaController.getGMADetails);
  router.post('/gma/:id/animals', auth, validate(addAnimalToGMASchema), gmaController.addAnimal);
  router.get('/gma/:id/animals', auth, gmaController.getGMAAnimals);

  // ─── Regulatory Documents ──────────────────────────────────────────

  router.post('/documents', auth, validate(createRegulatoryDocumentSchema), documentController.createDocument);
  router.patch('/documents/:id/status', auth, validate(updateDocumentStatusSchema), documentController.updateStatus);
  router.get('/documents', auth, documentController.listDocuments);
  router.get('/documents/expiring', auth, documentController.getExpiringDocuments);

  return router;
}
