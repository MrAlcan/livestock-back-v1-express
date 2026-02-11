import { DomainEvent } from '../../shared/DomainEvent';
import { UniqueId } from '../../shared/Entity';

export class SyncStartedEvent extends DomainEvent {
  readonly syncLogId: UniqueId;
  readonly deviceId: string;
  readonly userId: UniqueId;

  constructor(props: { syncLogId: UniqueId; deviceId: string; userId: UniqueId }) {
    super(props.syncLogId);
    this.syncLogId = props.syncLogId;
    this.deviceId = props.deviceId;
    this.userId = props.userId;
  }

  get eventName(): string { return 'SyncStartedEvent'; }
}

export class SyncCompletedEvent extends DomainEvent {
  readonly syncLogId: UniqueId;
  readonly uploadedRecords: number;
  readonly downloadedRecords: number;
  readonly conflictRecords: number;

  constructor(props: { syncLogId: UniqueId; uploadedRecords: number; downloadedRecords: number; conflictRecords: number }) {
    super(props.syncLogId);
    this.syncLogId = props.syncLogId;
    this.uploadedRecords = props.uploadedRecords;
    this.downloadedRecords = props.downloadedRecords;
    this.conflictRecords = props.conflictRecords;
  }

  get eventName(): string { return 'SyncCompletedEvent'; }
}

export class ConflictDetectedEvent extends DomainEvent {
  readonly conflictId: UniqueId;
  readonly entityType: string;
  readonly entityId: UniqueId;

  constructor(props: { conflictId: UniqueId; entityType: string; entityId: UniqueId }) {
    super(props.conflictId);
    this.conflictId = props.conflictId;
    this.entityType = props.entityType;
    this.entityId = props.entityId;
  }

  get eventName(): string { return 'ConflictDetectedEvent'; }
}
