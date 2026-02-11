import { Router } from 'express';
import { validate, validateQuery, validateParams, rbac } from '../../middlewares';
import {
  registerAnimalSchema,
  updateAnimalSchema,
  identifyAnimalSchema,
  updateWeightSchema,
  markDeadSchema,
  markSoldSchema,
  assignToLotSchema,
  assignToPaddockSchema,
  animalFiltersSchema,
  createBreedSchema,
  updateBreedSchema,
  recordGenealogySchema,
} from '../../schemas/animal.schema';
import { uuidParamSchema } from '../../schemas/common.schema';

export function createAnimalRoutes(
  animalController: any,
  breedController: any,
  genealogyController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Animal CRUD & operations ──────────────────────────────────────

  router.post('/', auth, validate(registerAnimalSchema), animalController.registerAnimal);
  router.get('/', auth, validateQuery(animalFiltersSchema), animalController.listAnimals);
  router.get('/active', auth, animalController.getActiveAnimals);
  router.get('/search', auth, animalController.searchAnimals);
  router.get('/by-lot/:lotId', auth, animalController.getAnimalsByLot);
  router.get('/:id', auth, validateParams(uuidParamSchema), animalController.getAnimalDetails);
  router.put('/:id', auth, validate(updateAnimalSchema), animalController.updateAnimal);
  router.patch('/:id/identify', auth, validate(identifyAnimalSchema), animalController.identifyAnimal);
  router.patch('/:id/weight', auth, validate(updateWeightSchema), animalController.updateWeight);
  router.patch('/:id/dead', auth, validate(markDeadSchema), animalController.markAsDead);
  router.patch('/:id/sold', auth, validate(markSoldSchema), animalController.markAsSold);
  router.patch('/:id/lot', auth, validate(assignToLotSchema), animalController.assignToLot);
  router.patch('/:id/paddock', auth, validate(assignToPaddockSchema), animalController.assignToPaddock);

  // ─── Breeds sub-routes ─────────────────────────────────────────────

  router.post('/breeds', auth, rbac(['PROPIETARIO', 'TECNICO']), validate(createBreedSchema), breedController.createBreed);
  router.put('/breeds/:id', auth, rbac(['PROPIETARIO', 'TECNICO']), validate(updateBreedSchema), breedController.updateBreed);
  router.delete('/breeds/:id', auth, rbac(['PROPIETARIO']), breedController.deleteBreed);
  router.get('/breeds/:id', auth, breedController.getBreedDetails);
  router.get('/breeds', auth, breedController.listBreeds);

  // ─── Genealogy sub-routes ──────────────────────────────────────────

  router.post('/genealogy', auth, validate(recordGenealogySchema), genealogyController.recordGenealogy);
  router.get('/genealogy/:animalId', auth, genealogyController.getGenealogyTree);
  router.get('/genealogy/:animalId/inbreeding', auth, genealogyController.calculateInbreeding);

  return router;
}
