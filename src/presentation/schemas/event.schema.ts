import { z } from 'zod';

const baseEventSchema = z.object({
  animalId: z.string().uuid(),
  eventDate: z.string().min(1, 'Fecha de evento requerida'),
  eventType: z.string().min(1),
  eventCategory: z.string().min(1),
  lotContext: z.string().uuid().optional(),
  paddockContext: z.string().uuid().optional(),
  gpsLocation: z.string().optional(),
  deviceId: z.string().optional(),
  offlineId: z.string().optional(),
  isManual: z.boolean().optional(),
  observations: z.string().optional(),
});

export const registerEventBirthSchema = baseEventSchema.extend({
  birthType: z.string().min(1),
  birthDifficulty: z.string().min(1),
  vitality: z.string().min(1),
  confirmedMotherId: z.string().uuid().optional(),
  birthWeight: z.number().positive().optional(),
  birthObservations: z.string().optional(),
});

export const registerEventDeathSchema = baseEventSchema.extend({
  deathCause: z.string().min(1, 'Causa de muerte requerida'),
  causeCategory: z.string().min(1),
  necropsyPerformed: z.boolean().optional(),
  isNotifiableSenasag: z.boolean().optional(),
  estimatedLossValue: z.object({ amount: z.number(), currency: z.string() }).optional(),
  documentationUrl: z.string().url().optional(),
});

export const registerEventHealthSchema = baseEventSchema.extend({
  productId: z.string().uuid(),
  productBatch: z.string().optional(),
  appliedDose: z.string().min(1),
  doseUnit: z.string().optional(),
  administrationRoute: z.string().optional(),
  applicationSite: z.string().optional(),
  treatmentResult: z.string().optional(),
  requiresFollowUp: z.boolean().optional(),
  nextCheckDate: z.string().optional(),
});

export const registerEventMovementSchema = baseEventSchema.extend({
  movementType: z.string().min(1),
  originLotId: z.string().uuid().optional(),
  destinationLotId: z.string().uuid().optional(),
  originPaddockId: z.string().uuid().optional(),
  destinationPaddockId: z.string().uuid().optional(),
  reason: z.string().optional(),
  weightAtMovement: z.number().positive().optional(),
});

export const registerEventWeighingSchema = baseEventSchema.extend({
  weight: z.number().positive('Peso debe ser positivo'),
  weighingType: z.string().min(1),
  bodyCondition: z.number().min(1).max(9).optional(),
  scaleDevice: z.string().optional(),
});

export const registerEventReproductionSchema = baseEventSchema.extend({
  serviceType: z.string().optional(),
  studId: z.string().uuid().optional(),
  result: z.string().optional(),
  diagnosisDate: z.string().optional(),
  diagnosisMethod: z.string().optional(),
  estimatedBirthDate: z.string().optional(),
  attemptNumber: z.number().int().positive().optional(),
});

export const registerEventSaleSchema = baseEventSchema.extend({
  gmaId: z.string().uuid(),
  destinationId: z.string().uuid(),
  saleWeight: z.number().positive(),
  salePrice: z.object({ amount: z.number().positive(), currency: z.string() }),
  pricePerKg: z.object({ amount: z.number().positive(), currency: z.string() }),
  saleType: z.string().min(1),
  qualityCategory: z.string().optional(),
});

export const registerEventPurchaseSchema = baseEventSchema.extend({
  supplierId: z.string().uuid(),
  purchasePrice: z.object({ amount: z.number().positive(), currency: z.string() }),
  purchaseWeight: z.number().positive().optional(),
  pricePerKg: z.object({ amount: z.number().positive(), currency: z.string() }).optional(),
});

export const registerEventWeaningSchema = baseEventSchema.extend({
  weaningWeight: z.number().positive(),
  ageDays: z.number().int().positive(),
  weaningType: z.string().min(1),
  motherPostWeanWeight: z.number().positive().optional(),
});

export const registerEventIdentificationSchema = baseEventSchema.extend({
  identificationType: z.string().min(1),
  previousIdentifier: z.string().optional(),
  newIdentifier: z.string().min(1),
  changeReason: z.string().optional(),
});

export const eventFiltersSchema = z.object({
  eventType: z.string().optional(),
  eventCategory: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  syncStatus: z.string().optional(),
});
