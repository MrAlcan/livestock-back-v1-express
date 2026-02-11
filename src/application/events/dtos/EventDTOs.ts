// ─── Base Event Input DTOs ──────────────────────────────────────────────────

export interface RegisterEventInputDTO {
  readonly animalId: string;
  readonly registeredBy: string;
  readonly eventDate: string;
  readonly eventType: string;
  readonly eventCategory: string;
  readonly lotContext?: string;
  readonly paddockContext?: string;
  readonly gpsLocation?: string;
  readonly deviceId?: string;
  readonly offlineId?: string;
  readonly isManual?: boolean;
  readonly observations?: string;
}

// ─── Specialized Event Input DTOs ───────────────────────────────────────────

export interface RegisterEventBirthInputDTO extends RegisterEventInputDTO {
  readonly birthType: string;
  readonly birthDifficulty: string;
  readonly vitality: string;
  readonly confirmedMotherId?: string;
  readonly birthWeight?: number;
  readonly birthObservations?: string;
}

export interface RegisterEventDeathInputDTO extends RegisterEventInputDTO {
  readonly deathCause: string;
  readonly causeCategory: string;
  readonly necropsyPerformed?: boolean;
  readonly isNotifiableSenasag?: boolean;
  readonly estimatedLossValue?: { amount: number; currency: string };
  readonly documentationUrl?: string;
}

export interface RegisterEventHealthInputDTO extends RegisterEventInputDTO {
  readonly productId: string;
  readonly productBatch?: string;
  readonly appliedDose: string;
  readonly doseUnit?: string;
  readonly administrationRoute?: string;
  readonly applicationSite?: string;
  readonly treatmentResult?: string;
  readonly requiresFollowUp?: boolean;
  readonly nextCheckDate?: string;
}

export interface RegisterEventMovementInputDTO extends RegisterEventInputDTO {
  readonly movementType: string;
  readonly originLotId?: string;
  readonly destinationLotId?: string;
  readonly originPaddockId?: string;
  readonly destinationPaddockId?: string;
  readonly reason?: string;
  readonly weightAtMovement?: number;
}

export interface RegisterEventWeighingInputDTO extends RegisterEventInputDTO {
  readonly weight: number;
  readonly weighingType: string;
  readonly bodyCondition?: number;
  readonly scaleDevice?: string;
}

export interface RegisterEventReproductionInputDTO extends RegisterEventInputDTO {
  readonly serviceType?: string;
  readonly studId?: string;
  readonly result?: string;
  readonly diagnosisDate?: string;
  readonly diagnosisMethod?: string;
  readonly estimatedBirthDate?: string;
  readonly attemptNumber?: number;
}

export interface RegisterEventSaleInputDTO extends RegisterEventInputDTO {
  readonly gmaId: string;
  readonly destinationId: string;
  readonly saleWeight: number;
  readonly salePrice: { amount: number; currency: string };
  readonly pricePerKg: { amount: number; currency: string };
  readonly saleType: string;
  readonly qualityCategory?: string;
}

export interface RegisterEventPurchaseInputDTO extends RegisterEventInputDTO {
  readonly supplierId: string;
  readonly purchasePrice: { amount: number; currency: string };
  readonly purchaseWeight?: number;
  readonly pricePerKg?: { amount: number; currency: string };
}

export interface RegisterEventWeaningInputDTO extends RegisterEventInputDTO {
  readonly weaningWeight: number;
  readonly ageDays: number;
  readonly weaningType: string;
  readonly motherPostWeanWeight?: number;
}

export interface RegisterEventIdentificationInputDTO extends RegisterEventInputDTO {
  readonly identificationType: string;
  readonly previousIdentifier?: string;
  readonly newIdentifier: string;
  readonly changeReason?: string;
}

// ─── Event Response DTOs ────────────────────────────────────────────────────

export interface EventResponseDTO {
  readonly id: string;
  readonly sequenceNumber?: string;
  readonly animalId: string;
  readonly registeredBy: string;
  readonly eventDate: string;
  readonly localRegistrationDate: string;
  readonly syncDate?: string;
  readonly eventType: string;
  readonly eventCategory: string;
  readonly lotContext?: string;
  readonly paddockContext?: string;
  readonly gpsLocation?: string;
  readonly deviceId?: string;
  readonly offlineId?: string;
  readonly isManual: boolean;
  readonly observations?: string;
  readonly syncStatus: string;
}

export interface EventBirthResponseDTO extends EventResponseDTO {
  readonly birthType: string;
  readonly birthDifficulty: string;
  readonly birthWeight?: number;
  readonly vitality: string;
  readonly confirmedMotherId?: string;
}

export interface EventWeighingResponseDTO extends EventResponseDTO {
  readonly weight: number;
  readonly weighingType: string;
  readonly bodyCondition?: number;
  readonly adg?: number;
  readonly daysSincePrevious?: number;
}

export interface EventReproductionResponseDTO extends EventResponseDTO {
  readonly serviceType?: string;
  readonly studId?: string;
  readonly result?: string;
  readonly diagnosisDate?: string;
  readonly estimatedBirthDate?: string;
  readonly attemptNumber: number;
}

// ─── Filter & Query DTOs ────────────────────────────────────────────────────

export interface EventFiltersInputDTO {
  readonly eventType?: string;
  readonly eventCategory?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly animalId?: string;
  readonly syncStatus?: string;
  readonly farmId: string;
}

// ─── Calculation Response DTOs ──────────────────────────────────────────────

export interface ADGCalculationResponseDTO {
  readonly animalId: string;
  readonly startWeight: number;
  readonly endWeight: number;
  readonly days: number;
  readonly adg: number;
}

export interface EstimatedBirthDateResponseDTO {
  readonly serviceDate: string;
  readonly estimatedBirthDate: string;
  readonly gestationDays: number;
}
