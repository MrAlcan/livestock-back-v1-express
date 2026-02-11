import { z } from 'zod';
import { LotType, LotStatus, PastureCondition } from '../../domain/lots/enums';

export const createLotSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  type: z.nativeEnum(LotType).optional(),
  description: z.string().optional(),
  targetWeight: z.number().positive().optional(),
  targetDays: z.number().int().positive().optional(),
});

export const updateLotSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  targetWeight: z.number().positive().optional(),
  targetDays: z.number().int().positive().optional(),
  assignedRationId: z.string().uuid().optional(),
});

export const lotFiltersSchema = z.object({
  type: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

export const createPaddockSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  hectares: z.number().positive().optional(),
  maxCapacityAU: z.number().positive().optional(),
  pastureType: z.string().optional(),
  pastureCondition: z.nativeEnum(PastureCondition).optional(),
  lastSeedingDate: z.string().optional(),
  recommendedRestDays: z.number().int().positive().optional(),
  hasWater: z.boolean(),
  hasShade: z.boolean(),
  observations: z.string().optional(),
});

export const updatePaddockSchema = z.object({
  name: z.string().optional(),
  hectares: z.number().positive().optional(),
  maxCapacityAU: z.number().positive().optional(),
  pastureType: z.string().optional(),
  pastureCondition: z.nativeEnum(PastureCondition).optional(),
  observations: z.string().optional(),
});

export const paddockFiltersSchema = z.object({
  pastureCondition: z.string().optional(),
  hasWater: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  hasShade: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  search: z.string().optional(),
});

export const updatePaddockConditionSchema = z.object({
  condition: z.nativeEnum(PastureCondition),
});
