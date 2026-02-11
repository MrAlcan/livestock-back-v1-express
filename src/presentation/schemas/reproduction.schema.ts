import { z } from 'zod';
import { ServiceType, ReproductionResult, DiagnosisMethod } from '../../domain/events/enums';

export const registerReproductiveServiceSchema = z.object({
  femaleId: z.string().uuid(),
  serviceDate: z.string().min(1, 'Fecha de servicio requerida'),
  serviceType: z.nativeEnum(ServiceType),
  studId: z.string().uuid().optional(),
});

export const recordDiagnosisSchema = z.object({
  femaleId: z.string().uuid(),
  diagnosisDate: z.string().min(1, 'Fecha de diagnóstico requerida'),
  result: z.nativeEnum(ReproductionResult),
  diagnosisMethod: z.nativeEnum(DiagnosisMethod).optional(),
  estimatedBirthDate: z.string().optional(),
});

export const recordBirthSchema = z.object({
  femaleId: z.string().uuid(),
  actualBirthDate: z.string().min(1, 'Fecha de parto requerida'),
  calfId: z.string().uuid().optional(),
  birthWeight: z.number().positive().optional(),
});

export const recordWeaningSchema = z.object({
  femaleId: z.string().uuid(),
  weaningDate: z.string().min(1, 'Fecha de destete requerida'),
  weaningWeight: z.number().positive('Peso de destete debe ser positivo'),
});

export const reproductiveCycleFiltersSchema = z.object({
  femaleId: z.string().uuid().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
