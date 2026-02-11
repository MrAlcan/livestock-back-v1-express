import { LotType, LotStatus, PastureCondition } from '../../../domain/lots/enums';

// ── Lot Input DTOs ───────────────────────────────────────────────────────────

export interface CreateLotInputDTO {
  readonly code: string;
  readonly name: string;
  readonly type?: LotType;
  readonly description?: string;
  readonly targetWeight?: number;
  readonly targetDays?: number;
  readonly farmId: string;
}

export interface UpdateLotInputDTO {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly targetWeight?: number;
  readonly targetDays?: number;
  readonly assignedRationId?: string;
}

// ── Lot Filters ──────────────────────────────────────────────────────────────

export interface LotFiltersInputDTO {
  readonly type?: LotType;
  readonly status?: LotStatus;
  readonly search?: string;
  readonly farmId: string;
}

// ── Lot Response DTOs ────────────────────────────────────────────────────────

export interface LotResponseDTO {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly type?: string;
  readonly farmId: string;
  readonly status: string;
  readonly creationDate: string;
  readonly closureDate?: string;
  readonly currentQuantity: number;
  readonly currentAverageWeight?: number;
  readonly targetWeight?: number;
  readonly targetDays?: number;
  readonly assignedRationId?: string;
}

export interface LotMetricsResponseDTO {
  readonly lotId: string;
  readonly animalCount: number;
  readonly averageWeight?: number;
  readonly targetWeight?: number;
  readonly daysActive: number;
  readonly hasReachedTarget: boolean;
}

// ── Paddock Input DTOs ───────────────────────────────────────────────────────

export interface CreatePaddockInputDTO {
  readonly code: string;
  readonly name: string;
  readonly hectares?: number;
  readonly maxCapacityAU?: number;
  readonly pastureType?: string;
  readonly pastureCondition?: PastureCondition;
  readonly lastSeedingDate?: string;
  readonly recommendedRestDays?: number;
  readonly hasWater: boolean;
  readonly hasShade: boolean;
  readonly farmId: string;
  readonly observations?: string;
}

export interface UpdatePaddockInputDTO {
  readonly id: string;
  readonly name?: string;
  readonly hectares?: number;
  readonly maxCapacityAU?: number;
  readonly pastureType?: string;
  readonly pastureCondition?: PastureCondition;
  readonly observations?: string;
}

// ── Paddock Filters ──────────────────────────────────────────────────────────

export interface PaddockFiltersInputDTO {
  readonly pastureCondition?: PastureCondition;
  readonly hasWater?: boolean;
  readonly hasShade?: boolean;
  readonly search?: string;
  readonly farmId: string;
}

// ── Paddock Response DTOs ────────────────────────────────────────────────────

export interface PaddockResponseDTO {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly hectares?: number;
  readonly maxCapacityAU?: number;
  readonly pastureType?: string;
  readonly pastureCondition?: string;
  readonly lastSeedingDate?: string;
  readonly recommendedRestDays?: number;
  readonly lastEntryDate?: string;
  readonly hasWater: boolean;
  readonly hasShade: boolean;
  readonly farmId: string;
  readonly observations?: string;
}

export interface PaddockCapacityResponseDTO {
  readonly paddockId: string;
  readonly maxCapacity?: number;
  readonly currentOccupancy: number;
  readonly availableSpace?: number;
  readonly canReceive: boolean;
}
