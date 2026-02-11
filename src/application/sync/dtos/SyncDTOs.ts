import { SyncLogStatus } from '../../../domain/sync/enums';

// ── Sync Input DTOs ──────────────────────────────────────────────────────────

export interface InitiateSyncInputDTO {
  readonly deviceId: string;
  readonly userId: string;
  readonly lastSyncDate?: string;
  readonly deviceMetadata?: Record<string, unknown>;
}

export interface SyncChangeItemDTO {
  readonly entityType: string;
  readonly entityId: string;
  readonly action: 'CREATE' | 'UPDATE' | 'DELETE';
  readonly data: Record<string, unknown>;
  readonly version: number;
  readonly modifiedAt: string;
}

export interface ApplySyncChangesInputDTO {
  readonly syncLogId: string;
  readonly changes: SyncChangeItemDTO[];
  readonly strategy?: string;
}

export interface ResolveConflictInputDTO {
  readonly conflictId: string;
  readonly resolutionStrategy: string;
  readonly resolvedBy: string;
}

// ── Sync Filters ─────────────────────────────────────────────────────────────

export interface SyncHistoryFiltersDTO {
  readonly deviceId?: string;
  readonly userId?: string;
  readonly status?: SyncLogStatus;
  readonly startDate?: string;
  readonly endDate?: string;
}

// ── Sync Response DTOs ───────────────────────────────────────────────────────

export interface SyncLogResponseDTO {
  readonly id: string;
  readonly deviceId: string;
  readonly userId: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly status: string;
  readonly uploadedRecords?: number;
  readonly downloadedRecords?: number;
  readonly conflictRecords?: number;
  readonly errorMessage?: string;
  readonly durationSeconds?: number;
}

export interface ConflictResolutionResponseDTO {
  readonly id: string;
  readonly syncLogId: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly serverVersion: Record<string, unknown>;
  readonly clientVersion: Record<string, unknown>;
  readonly resolutionStrategy: string;
  readonly resolvedBy?: string;
  readonly resolvedAt?: string;
  readonly notes?: string;
}

export interface SyncStatusResponseDTO {
  readonly pendingChanges: number;
  readonly lastSyncDate?: string;
  readonly conflicts: number;
}
