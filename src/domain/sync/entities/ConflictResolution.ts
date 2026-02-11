import { Entity, UniqueId } from '../../shared/Entity';
import { ResolutionStrategy } from '../enums';

interface ConflictResolutionProps {
  syncLogId: UniqueId;
  entityType: string;
  entityId: UniqueId;
  serverVersion: Record<string, unknown>;
  clientVersion: Record<string, unknown>;
  resolutionStrategy: ResolutionStrategy;
  resolvedBy?: UniqueId;
  resolvedAt?: Date;
  notes?: string;
}

export class ConflictResolution extends Entity<ConflictResolutionProps> {
  private readonly _syncLogId: UniqueId;
  private readonly _entityType: string;
  private readonly _entityId: UniqueId;
  private readonly _serverVersion: Record<string, unknown>;
  private readonly _clientVersion: Record<string, unknown>;
  private _resolutionStrategy: ResolutionStrategy;
  private _resolvedBy?: UniqueId;
  private _resolvedAt?: Date;
  private _notes?: string;

  private constructor(props: ConflictResolutionProps, id?: UniqueId, createdAt?: Date) {
    super(id, createdAt);
    this._syncLogId = props.syncLogId;
    this._entityType = props.entityType;
    this._entityId = props.entityId;
    this._serverVersion = props.serverVersion;
    this._clientVersion = props.clientVersion;
    this._resolutionStrategy = props.resolutionStrategy;
    this._resolvedBy = props.resolvedBy;
    this._resolvedAt = props.resolvedAt;
    this._notes = props.notes;
  }

  static create(props: ConflictResolutionProps, id?: UniqueId, createdAt?: Date): ConflictResolution {
    if (props.resolutionStrategy === ResolutionStrategy.ADMIN_DECIDES && props.resolvedBy === undefined && props.resolvedAt !== undefined) {
      throw new Error('Manual resolution requires a resolver');
    }
    return new ConflictResolution(props, id, createdAt);
  }

  get syncLogId(): UniqueId { return this._syncLogId; }
  get entityType(): string { return this._entityType; }
  get entityId(): UniqueId { return this._entityId; }
  get serverVersion(): Record<string, unknown> { return this._serverVersion; }
  get clientVersion(): Record<string, unknown> { return this._clientVersion; }
  get resolutionStrategy(): ResolutionStrategy { return this._resolutionStrategy; }
  get resolvedBy(): UniqueId | undefined { return this._resolvedBy; }
  get resolvedAt(): Date | undefined { return this._resolvedAt; }
  get notes(): string | undefined { return this._notes; }

  isResolved(): boolean {
    return this._resolvedAt !== undefined;
  }

  resolve(strategy: ResolutionStrategy, userId: UniqueId): void {
    this._resolutionStrategy = strategy;
    this._resolvedBy = userId;
    this._resolvedAt = new Date();
  }
}
