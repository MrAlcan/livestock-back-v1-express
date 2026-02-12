import { AnimalSex, AnimalStatus, AnimalOrigin, BreedAptitude, RelationType, SyncStatus } from '../../../domain/animals/enums';

// ── Animal Input DTOs ──────────────────────────────────────────────────────────

export interface RegisterAnimalInputDTO {
  readonly officialId?: string;
  readonly temporaryId?: string;
  readonly brandMark?: string;
  readonly visualTag?: string;
  readonly electronicId?: string;
  readonly sex: AnimalSex;
  readonly birthDate?: string;
  readonly isEstimatedBirthDate?: boolean;
  readonly breedId?: string;
  readonly breedPercentage?: number;
  readonly coatColor?: string;
  readonly origin: AnimalOrigin;
  readonly motherId?: string;
  readonly fatherId?: string;
  readonly currentLotId?: string;
  readonly currentPaddockId?: string;
  readonly birthWeight?: number;
  readonly farmId: string;
  readonly photoUrl?: string;
  readonly observations?: string;
}

export interface UpdateAnimalInputDTO {
  readonly id: string;
  readonly coatColor?: string;
  readonly observations?: string;
  readonly photoUrl?: string;
}

export interface IdentifyAnimalInputDTO {
  readonly id: string;
  readonly officialId: string;
}

export interface UpdateAnimalWeightInputDTO {
  readonly id: string;
  readonly weight: number;
  readonly date: string;
}

export interface MarkAnimalAsDeadInputDTO {
  readonly id: string;
  readonly cause: string;
  readonly date: string;
}

export interface MarkAnimalAsSoldInputDTO {
  readonly id: string;
  readonly date: string;
}

export interface AssignAnimalToLotInputDTO {
  readonly animalId: string;
  readonly lotId: string;
}

export interface AssignAnimalToPaddockInputDTO {
  readonly animalId: string;
  readonly paddockId: string;
}

// ── Animal Filters ─────────────────────────────────────────────────────────────

export interface AnimalFiltersInputDTO {
  readonly status?: AnimalStatus;
  readonly sex?: AnimalSex;
  readonly breedId?: string;
  readonly origin?: AnimalOrigin;
  readonly lotId?: string;
  readonly paddockId?: string;
  readonly search?: string;
  readonly minWeight?: number;
  readonly maxWeight?: number;
  readonly farmId: string;
}

// ── Animal Response DTO ────────────────────────────────────────────────────────

export interface AnimalResponseDTO {
  readonly id: string;
  readonly officialId?: string;
  readonly temporaryId?: string;
  readonly brandMark?: string;
  readonly visualTag?: string;
  readonly electronicId?: string;
  readonly sex: string;
  readonly birthDate?: string;
  readonly isEstimatedBirthDate: boolean;
  readonly ageMonths?: number;
  readonly breedId?: number;
  readonly breedPercentage?: number;
  readonly coatColor?: string;
  readonly status: string;
  readonly substatus?: string;
  readonly exitDate?: string;
  readonly exitReason?: string;
  readonly birthWeight?: number;
  readonly currentWeight?: number;
  readonly lastWeighingDate?: string;
  readonly motherId?: string;
  readonly fatherId?: string;
  readonly currentLotId?: string;
  readonly currentPaddockId?: string;
  readonly farmId: string;
  readonly origin: string;
  readonly observations?: string;
  readonly photoUrl?: string;
  readonly syncStatus: string;
}

// ── Breed DTOs ─────────────────────────────────────────────────────────────────

export interface CreateBreedInputDTO {
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly origin?: string;
  readonly averageAdultWeight?: number;
  readonly aptitude?: BreedAptitude;
}

export interface UpdateBreedInputDTO {
  readonly id: number;
  readonly code?: string;
  readonly name?: string;
  readonly description?: string;
}

export interface BreedResponseDTO {
  readonly id: number;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly origin?: string;
  readonly averageAdultWeight?: number;
  readonly aptitude?: string;
  readonly active: boolean;
}

// ── Genealogy DTOs ─────────────────────────────────────────────────────────────

export interface GenealogyResponseDTO {
  readonly id: string;
  readonly animalId: string;
  readonly ancestorId: string;
  readonly relationType: string;
  readonly generation: number;
  readonly inbreedingCoefficient?: number;
}

export interface RecordGenealogyInputDTO {
  readonly animalId: string;
  readonly ancestorId: string;
  readonly relationType: RelationType;
  readonly generation: number;
}

// ── Inbreeding DTO ─────────────────────────────────────────────────────────────

export interface InbreedingResultDTO {
  readonly animal1Id: string;
  readonly animal2Id: string;
  readonly coefficient: number;
  readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
