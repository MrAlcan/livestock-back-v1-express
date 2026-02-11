import { z } from 'zod';
import { GMAType, DocumentType, DocumentStatus } from '../../domain/senasag/enums';

export const createGMASchema = z.object({
  internalNumber: z.string().min(1, 'Número interno requerido'),
  transporterId: z.string().uuid(),
  destinationId: z.string().uuid(),
  type: z.nativeEnum(GMAType),
  requestDate: z.string().min(1, 'Fecha de solicitud requerida'),
  animalQuantity: z.number().int().positive(),
  estimatedTotalWeight: z.number().positive().optional(),
  distanceKm: z.number().positive().optional(),
  route: z.string().optional(),
  observations: z.string().optional(),
});

export const approveGMASchema = z.object({
  gmaCode: z.string().min(1, 'Código GMA requerido'),
  issueDate: z.string().min(1, 'Fecha de emisión requerida'),
});

export const rejectGMASchema = z.object({
  rejectionReason: z.string().min(1, 'Motivo de rechazo requerido'),
});

export const markGMAInTransitSchema = z.object({
  actualDepartureDate: z.string().min(1, 'Fecha de salida requerida'),
});

export const closeGMASchema = z.object({
  actualArrivalDate: z.string().min(1, 'Fecha de llegada requerida'),
  actualTotalWeight: z.number().positive('Peso total debe ser positivo'),
});

export const addAnimalToGMASchema = z.object({
  animalId: z.string().uuid(),
  departureWeight: z.number().positive().optional(),
});

export const gmaFiltersSchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export const createRegulatoryDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  documentNumber: z.string().min(1, 'Número de documento requerido'),
  issueDate: z.string().min(1, 'Fecha de emisión requerida'),
  expirationDate: z.string().optional(),
  issuingEntity: z.string().optional(),
  fileUrl: z.string().url().optional(),
  observations: z.string().optional(),
});

export const updateDocumentStatusSchema = z.object({
  status: z.nativeEnum(DocumentStatus).optional(),
  fileUrl: z.string().url().optional(),
  observations: z.string().optional(),
});
