import { z } from 'zod';

export const initiateSyncSchema = z.object({
  deviceId: z.string().min(1, 'ID de dispositivo requerido'),
  lastSyncDate: z.string().optional(),
  deviceMetadata: z.record(z.string(), z.unknown()).optional(),
});

export const applySyncChangesSchema = z.object({
  syncLogId: z.string().uuid('UUID inválido'),
  changes: z.array(z.object({
    entityType: z.string().min(1, 'Campo requerido'),
    entityId: z.string().uuid('UUID inválido'),
    action: z.enum(['CREATE', 'UPDATE', 'DELETE']),
    data: z.record(z.string(), z.unknown()),
    version: z.number().int().min(1, 'Debe ser al menos 1'),
    modifiedAt: z.string().min(1, 'Campo requerido'),
  })),
  strategy: z.string().optional(),
});

export const resolveConflictSchema = z.object({
  resolutionStrategy: z.string().min(1, 'Estrategia de resolución requerida'),
});

export const syncHistoryFiltersSchema = z.object({
  deviceId: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
