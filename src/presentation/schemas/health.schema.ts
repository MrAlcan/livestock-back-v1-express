import { z } from 'zod';
import { InventoryMovementType, TaskType, TaskPriority, TaskStatus, RationType } from '../../domain/health/enums';

export const createProductSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  commercialName: z.string().optional(),
  genericName: z.string().optional(),
  type: z.string().min(1, 'Tipo requerido'),
  category: z.string().optional(),
  currentStock: z.number().min(0),
  minStock: z.number().min(0).optional(),
  maxStock: z.number().min(0).optional(),
  unit: z.string().min(1, 'Unidad requerida'),
  unitCost: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  withdrawalDays: z.number().int().min(0),
  activeIngredient: z.string().optional(),
  concentration: z.string().optional(),
  manufacturer: z.string().optional(),
  requiresPrescription: z.boolean().optional(),
  isRefrigerated: z.boolean().optional(),
  storageTemperature: z.string().optional(),
  observations: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  commercialName: z.string().optional(),
  category: z.string().optional(),
  unitCost: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  minStock: z.number().min(0).optional(),
  maxStock: z.number().min(0).optional(),
  observations: z.string().optional(),
});

export const productFiltersSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  active: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  search: z.string().optional(),
  lowStock: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
});

export const recordInventoryMovementSchema = z.object({
  productId: z.string().uuid(),
  movementType: z.nativeEnum(InventoryMovementType),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  unitCost: z.number().positive().optional(),
  movementDate: z.string().min(1),
  productBatch: z.string().optional(),
  expirationDate: z.string().optional(),
  supplierId: z.string().uuid().optional(),
  reason: z.string().optional(),
});

export const createHealthTaskSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  type: z.nativeEnum(TaskType).optional(),
  assignedTo: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  estimatedQuantity: z.number().positive().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().min(1, 'Fecha límite requerida'),
  priority: z.nativeEnum(TaskPriority),
  requiresNotification: z.boolean().optional(),
  instructions: z.string().optional(),
  observations: z.string().optional(),
});

export const updateHealthTaskSchema = z.object({
  name: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  completionPct: z.number().min(0).max(100).optional(),
  observations: z.string().optional(),
});

export const taskFiltersSchema = z.object({
  type: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const createRationSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  type: z.nativeEnum(RationType),
  description: z.string().optional(),
  dryMatterPct: z.number().min(0).max(100).optional(),
  proteinPct: z.number().min(0).max(100).optional(),
  energyMcalKg: z.number().positive().optional(),
  costPerTon: z.number().positive().optional(),
  estimatedConversion: z.number().positive().optional(),
});

export const updateRationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  dryMatterPct: z.number().min(0).max(100).optional(),
  proteinPct: z.number().min(0).max(100).optional(),
  energyMcalKg: z.number().positive().optional(),
  costPerTon: z.number().positive().optional(),
  estimatedConversion: z.number().positive().optional(),
});

export const addRationIngredientSchema = z.object({
  productId: z.string().uuid(),
  percentage: z.number().min(0).max(100),
  kgPerTon: z.number().positive().optional(),
});

export const assignRationToLotSchema = z.object({
  rationId: z.string().uuid(),
  lotId: z.string().uuid(),
});
