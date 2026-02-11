import { z } from 'zod';

export const uuidParamSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
