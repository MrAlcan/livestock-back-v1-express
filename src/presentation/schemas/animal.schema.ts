import { z } from 'zod';
import { AnimalSex, AnimalOrigin, BreedAptitude, RelationType } from '../../domain/animals/enums';

export const registerAnimalSchema = z.object({
  officialId: z.string().optional(),
  temporaryId: z.string().optional(),
  brandMark: z.string().optional(),
  visualTag: z.string().optional(),
  electronicId: z.string().optional(),
  sex: z.nativeEnum(AnimalSex),
  birthDate: z.string().optional(),
  isEstimatedBirthDate: z.boolean().optional(),
  breedId: z.string().optional(),
  breedPercentage: z.number().min(0).max(100).optional(),
  coatColor: z.string().optional(),
  origin: z.nativeEnum(AnimalOrigin),
  motherId: z.string().uuid().optional(),
  fatherId: z.string().uuid().optional(),
  currentLotId: z.string().uuid().optional(),
  currentPaddockId: z.string().uuid().optional(),
  birthWeight: z.number().positive().optional(),
  photoUrl: z.string().url().optional(),
  observations: z.string().optional(),
});

export const updateAnimalSchema = z.object({
  coatColor: z.string().optional(),
  observations: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export const identifyAnimalSchema = z.object({
  officialId: z.string().min(1, 'ID oficial requerido'),
});

export const updateWeightSchema = z.object({
  weight: z.number().positive('Peso debe ser positivo'),
  date: z.string().min(1, 'Fecha requerida'),
});

export const markDeadSchema = z.object({
  cause: z.string().min(1, 'Causa requerida'),
  date: z.string().min(1, 'Fecha requerida'),
});

export const markSoldSchema = z.object({
  date: z.string().min(1, 'Fecha requerida'),
});

export const assignToLotSchema = z.object({
  lotId: z.string().uuid('ID de lote debe ser UUID válido'),
});

export const assignToPaddockSchema = z.object({
  paddockId: z.string().uuid('ID de potrero debe ser UUID válido'),
});

export const animalFiltersSchema = z.object({
  status: z.string().optional(),
  sex: z.string().optional(),
  breedId: z.string().optional(),
  origin: z.string().optional(),
  lotId: z.string().uuid().optional(),
  paddockId: z.string().uuid().optional(),
  search: z.string().optional(),
  minWeight: z.coerce.number().optional(),
  maxWeight: z.coerce.number().optional(),
});

export const createBreedSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  origin: z.string().optional(),
  averageAdultWeight: z.number().positive().optional(),
  aptitude: z.nativeEnum(BreedAptitude).optional(),
});

export const updateBreedSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const recordGenealogySchema = z.object({
  animalId: z.string().uuid('ID de animal debe ser UUID'),
  ancestorId: z.string().uuid('ID de ancestro debe ser UUID'),
  relationType: z.nativeEnum(RelationType),
  generation: z.number().int().min(1),
});
