import { Entity, UniqueId } from '../../shared/Entity';
import { SyncLogStatus } from '../enums';

interface SyncLogProps {
  deviceId: string;
  userId: UniqueId;
  startDate: Date;
  endDate?: Date;
  status: SyncLogStatus;
  uploadedRecords?: number;
  downloadedRecords?: number;
  conflictRecords?: number;
  conflicts?: Record<string, unknown>;
  errorMessage?: string;
  durationSeconds?: number;
  deviceMetadata?: Record<string, unknown>;
}

export class SyncLog extends Entity<SyncLogProps> {
  private readonly _deviceId: string;
  private readonly _userId: UniqueId;
  private readonly _startDate: Date;
  private _endDate?: Date;
  private _status: SyncLogStatus;
  private _uploadedRecords?: number;
  private _downloadedRecords?: number;
  private _conflictRecords?: number;
  private _conflicts?: Record<string, unknown>;
  private _errorMessage?: string;
  private _durationSeconds?: number;
  private readonly _deviceMetadata?: Record<string, unknown>;

  private constructor(props: SyncLogProps, id?: UniqueId, createdAt?: Date) {
    super(id, createdAt);
    this._deviceId = props.deviceId;
    this._userId = props.userId;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._status = props.status;
    this._uploadedRecords = props.uploadedRecords;
    this._downloadedRecords = props.downloadedRecords;
    this._conflictRecords = props.conflictRecords;
    this._conflicts = props.conflicts;
    this._errorMessage = props.errorMessage;
    this._durationSeconds = props.durationSeconds;
    this._deviceMetadata = props.deviceMetadata;
  }

  static create(props: SyncLogProps, id?: UniqueId, createdAt?: Date): SyncLog {
    return new SyncLog(props, id, createdAt);
  }

  get deviceId(): string { return this._deviceId; }
  get userId(): UniqueId { return this._userId; }
  get startDate(): Date { return this._startDate; }
  get endDate(): Date | undefined { return this._endDate; }
  get status(): SyncLogStatus { return this._status; }
  get uploadedRecords(): number | undefined { return this._uploadedRecords; }
  get downloadedRecords(): number | undefined { return this._downloadedRecords; }
  get conflictRecords(): number | undefined { return this._conflictRecords; }
  get conflicts(): Record<string, unknown> | undefined { return this._conflicts; }
  get errorMessage(): string | undefined { return this._errorMessage; }
  get durationSeconds(): number | undefined { return this._durationSeconds; }
  get deviceMetadata(): Record<string, unknown> | undefined { return this._deviceMetadata; }

  isSuccessful(): boolean {
    return this._status === SyncLogStatus.COMPLETED;
  }

  hasFailed(): boolean {
    return this._status === SyncLogStatus.ERROR;
  }

  hasConflicts(): boolean {
    return (this._conflictRecords ?? 0) > 0;
  }

  complete(uploadedCount: number, downloadedCount: number): void {
    this._endDate = new Date();
    this._uploadedRecords = uploadedCount;
    this._downloadedRecords = downloadedCount;
    this._status = SyncLogStatus.COMPLETED;
    this._durationSeconds = Math.floor((this._endDate.getTime() - this._startDate.getTime()) / 1000);
  }

  fail(error: string): void {
    this._endDate = new Date();
    this._errorMessage = error;
    this._status = SyncLogStatus.ERROR;
    this._durationSeconds = Math.floor((this._endDate.getTime() - this._startDate.getTime()) / 1000);
  }
}
