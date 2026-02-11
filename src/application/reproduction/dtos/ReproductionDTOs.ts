import { ServiceType, ReproductionResult, DiagnosisMethod } from '../../../domain/events/enums';

// ── Reproductive Service Input DTOs ──────────────────────────────────────────

export interface RegisterReproductiveServiceInputDTO {
  readonly femaleId: string;
  readonly serviceDate: string;
  readonly serviceType: ServiceType;
  readonly studId?: string;
  readonly registeredBy: string;
}

export interface RecordDiagnosisInputDTO {
  readonly femaleId: string;
  readonly diagnosisDate: string;
  readonly result: ReproductionResult;
  readonly diagnosisMethod?: DiagnosisMethod;
  readonly estimatedBirthDate?: string;
}

export interface RecordBirthInputDTO {
  readonly femaleId: string;
  readonly actualBirthDate: string;
  readonly calfId?: string;
  readonly birthWeight?: number;
}

export interface RecordWeaningInputDTO {
  readonly femaleId: string;
  readonly weaningDate: string;
  readonly weaningWeight: number;
}

// ── Reproductive Cycle Response DTO ──────────────────────────────────────────

export interface ReproductiveCycleResponseDTO {
  readonly femaleId: string;
  readonly studId?: string;
  readonly serviceDate: string;
  readonly serviceType: string;
  readonly diagnosisDate?: string;
  readonly result?: string;
  readonly estimatedBirthDate?: string;
  readonly actualBirthDate?: string;
  readonly calfId?: string;
  readonly weaningDate?: string;
  readonly weaningWeight?: number;
  readonly gestationDays?: number;
}

// ── Reproductive Performance Response DTO ────────────────────────────────────

export interface ReproductivePerformanceResponseDTO {
  readonly femaleId: string;
  readonly totalCycles: number;
  readonly successfulCycles: number;
  readonly failedCycles: number;
  readonly fertilityRate: number;
  readonly averageGestationDays?: number;
  readonly averageCalvingInterval?: number;
}

// ── Farm Reproductive Stats Response DTO ─────────────────────────────────────

export interface FarmReproductiveStatsResponseDTO {
  readonly totalFemales: number;
  readonly activeFemales: number;
  readonly currentlyPregnant: number;
  readonly pregnancyRate: number;
  readonly averageGestationDays?: number;
}

// ── Reproductive Cycle Filters DTO ───────────────────────────────────────────

export interface ReproductiveCycleFiltersDTO {
  readonly femaleId?: string;
  readonly status?: ReproductionResult;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly farmId: string;
}
