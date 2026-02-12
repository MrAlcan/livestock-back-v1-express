import { GMAType, GMAStatus, DocumentType, DocumentStatus } from '../../../domain/senasag/enums';

// ── GMA Input DTOs ───────────────────────────────────────────────────────────

export interface CreateGMAInputDTO {
  readonly internalNumber: string;
  readonly registrarId: string;
  readonly originFarmId: string;
  readonly transporterId: string;
  readonly destinationId: string;
  readonly type: GMAType;
  readonly requestDate: string;
  readonly animalQuantity: number;
  readonly estimatedTotalWeight?: number;
  readonly distanceKm?: number;
  readonly route?: string;
  readonly observations?: string;
}

export interface ApproveGMAInputDTO {
  readonly gmaId: string;
  readonly gmaCode: string;
  readonly issueDate: string;
}

export interface RejectGMAInputDTO {
  readonly gmaId: string;
  readonly rejectionReason: string;
}

export interface MarkGMAInTransitInputDTO {
  readonly gmaId: string;
  readonly actualDepartureDate: string;
}

export interface CloseGMAInputDTO {
  readonly gmaId: string;
  readonly actualArrivalDate: string;
  readonly actualTotalWeight: number;
}

export interface AddAnimalToGMAInputDTO {
  readonly gmaId: string;
  readonly animalId: string;
  readonly departureWeight?: number;
}

// ── GMA Filters ──────────────────────────────────────────────────────────────

export interface GMAFiltersInputDTO {
  readonly status?: GMAStatus;
  readonly type?: GMAType;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly search?: string;
  readonly farmId: string;
}

// ── GMA Response DTOs ────────────────────────────────────────────────────────

export interface GMAResponseDTO {
  readonly id: string;
  readonly internalNumber: string;
  readonly gmaCode?: string;
  readonly temporaryCode?: string;
  readonly registrarId: string;
  readonly originFarmId: string;
  readonly transporterId: string;
  readonly destinationId: string;
  readonly type: string;
  readonly issueDate?: string;
  readonly expirationDate?: string;
  readonly actualDepartureDate?: string;
  readonly estimatedArrivalDate?: string;
  readonly actualArrivalDate?: string;
  readonly status: string;
  readonly rejectionReason?: string;
  readonly animalQuantity: number;
  readonly estimatedTotalWeight?: number;
  readonly actualTotalWeight?: number;
  readonly distanceKm?: number;
  readonly route?: string;
  readonly observations?: string;
}

export interface GMAAnimalResponseDTO {
  readonly gmaId: string;
  readonly animalId: string;
  readonly departureWeight?: number;
  readonly arrivalWeight?: number;
  readonly departureStatus?: string;
  readonly arrivalStatus?: string;
}

// ── Regulatory Document Input DTOs ───────────────────────────────────────────

export interface CreateRegulatoryDocumentInputDTO {
  readonly type: DocumentType;
  readonly documentNumber: string;
  readonly farmId: string;
  readonly issueDate: string;
  readonly expirationDate?: string;
  readonly issuingEntity?: string;
  readonly fileUrl?: string;
  readonly observations?: string;
}

export interface UpdateRegulatoryDocumentInputDTO {
  readonly id: string;
  readonly status?: DocumentStatus;
  readonly fileUrl?: string;
  readonly observations?: string;
}

// ── Regulatory Document Response DTOs ────────────────────────────────────────

export interface RegulatoryDocumentResponseDTO {
  readonly id: string;
  readonly type: string;
  readonly documentNumber: string;
  readonly farmId?: string;
  readonly issueDate: string;
  readonly expirationDate?: string;
  readonly issuingEntity?: string;
  readonly fileUrl?: string;
  readonly status: string;
  readonly daysUntilExpiration?: number;
  readonly observations?: string;
}

export interface ExpiringDocumentsResponseDTO {
  readonly documents: RegulatoryDocumentResponseDTO[];
  readonly threshold: number;
}
