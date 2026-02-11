import { DomainError } from '../../shared/DomainError';

export class SyncFailedError extends DomainError {
  constructor(message: string = 'Synchronization failed') {
    super(message, 'SYNC_FAILED');
  }
}

export class ConflictNotResolvableError extends DomainError {
  constructor(entityType: string, entityId: string) {
    super(`Conflict cannot be resolved automatically for ${entityType} ${entityId}`, 'CONFLICT_NOT_RESOLVABLE');
  }
}

export class DeviceNotAuthorizedError extends DomainError {
  constructor(deviceId: string) {
    super(`Device not authorized: ${deviceId}`, 'DEVICE_NOT_AUTHORIZED');
  }
}

export class InvalidSyncPayloadError extends DomainError {
  constructor(message: string = 'Invalid sync payload') {
    super(message, 'INVALID_SYNC_PAYLOAD');
  }
}
