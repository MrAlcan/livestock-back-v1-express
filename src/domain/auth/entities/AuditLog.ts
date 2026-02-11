import { Entity, UniqueId } from '../../shared/Entity';
import { AuditAction } from '../enums/AuditAction';

interface AuditLogProps {
  userId: UniqueId;
  action: AuditAction;
  tableName: string;
  recordId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLog extends Entity<AuditLogProps> {
  private readonly _userId: UniqueId;
  private readonly _action: AuditAction;
  private readonly _tableName: string;
  private readonly _recordId: string;
  private readonly _oldValues?: Record<string, unknown>;
  private readonly _newValues?: Record<string, unknown>;
  private readonly _ipAddress?: string;
  private readonly _userAgent?: string;

  private constructor(props: AuditLogProps, id?: UniqueId, createdAt?: Date) {
    super(id, createdAt);
    this._userId = props.userId;
    this._action = props.action;
    this._tableName = props.tableName;
    this._recordId = props.recordId;
    this._oldValues = props.oldValues;
    this._newValues = props.newValues;
    this._ipAddress = props.ipAddress;
    this._userAgent = props.userAgent;
  }

  static create(props: AuditLogProps, id?: UniqueId, createdAt?: Date): AuditLog {
    if (!props.tableName || props.tableName.trim().length === 0) {
      throw new Error('Table name is required');
    }
    if (!props.recordId || props.recordId.trim().length === 0) {
      throw new Error('Record ID is required');
    }
    return new AuditLog(props, id, createdAt);
  }

  get userId(): UniqueId { return this._userId; }
  get action(): AuditAction { return this._action; }
  get tableName(): string { return this._tableName; }
  get recordId(): string { return this._recordId; }
  get oldValues(): Record<string, unknown> | undefined { return this._oldValues; }
  get newValues(): Record<string, unknown> | undefined { return this._newValues; }
  get ipAddress(): string | undefined { return this._ipAddress; }
  get userAgent(): string | undefined { return this._userAgent; }
}
