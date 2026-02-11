import { Entity, UniqueId } from '../../shared/Entity';
import { DocumentType, DocumentStatus } from '../enums';

interface RegulatoryDocumentProps {
  type: DocumentType;
  documentNumber: string;
  farmId?: UniqueId;
  issueDate: Date;
  expirationDate?: Date;
  issuingEntity?: string;
  fileUrl?: string;
  fileHash?: string;
  status: DocumentStatus;
  daysBeforeExpiration: number;
  observations?: string;
  metadata?: Record<string, unknown>;
}

export class RegulatoryDocument extends Entity<RegulatoryDocumentProps> {
  private readonly _type: DocumentType;
  private _documentNumber: string;
  private _farmId?: UniqueId;
  private _issueDate: Date;
  private _expirationDate?: Date;
  private _issuingEntity?: string;
  private _fileUrl?: string;
  private _fileHash?: string;
  private _status: DocumentStatus;
  private _daysBeforeExpiration: number;
  private _observations?: string;
  private _metadata?: Record<string, unknown>;

  private constructor(props: RegulatoryDocumentProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._type = props.type;
    this._documentNumber = props.documentNumber;
    this._farmId = props.farmId;
    this._issueDate = props.issueDate;
    this._expirationDate = props.expirationDate;
    this._issuingEntity = props.issuingEntity;
    this._fileUrl = props.fileUrl;
    this._fileHash = props.fileHash;
    this._status = props.status;
    this._daysBeforeExpiration = props.daysBeforeExpiration;
    this._observations = props.observations;
    this._metadata = props.metadata;
  }

  static create(props: RegulatoryDocumentProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): RegulatoryDocument {
    if (!props.documentNumber || props.documentNumber.trim().length === 0) {
      throw new Error('Document number is required');
    }
    if (props.expirationDate && props.expirationDate <= props.issueDate) {
      throw new Error('Expiration date must be after issue date');
    }
    return new RegulatoryDocument(props, id, createdAt, updatedAt);
  }

  get type(): DocumentType { return this._type; }
  get documentNumber(): string { return this._documentNumber; }
  get farmId(): UniqueId | undefined { return this._farmId; }
  get issueDate(): Date { return this._issueDate; }
  get expirationDate(): Date | undefined { return this._expirationDate; }
  get issuingEntity(): string | undefined { return this._issuingEntity; }
  get fileUrl(): string | undefined { return this._fileUrl; }
  get fileHash(): string | undefined { return this._fileHash; }
  get status(): DocumentStatus { return this._status; }
  get daysBeforeExpiration(): number { return this._daysBeforeExpiration; }
  get observations(): string | undefined { return this._observations; }
  get metadata(): Record<string, unknown> | undefined { return this._metadata; }

  isValid(): boolean {
    return this._status === DocumentStatus.VALID;
  }

  isExpired(): boolean {
    if (!this._expirationDate) return false;
    return new Date() > this._expirationDate;
  }

  isExpiringSoon(): boolean {
    if (!this._expirationDate) return false;
    const daysUntil = this.daysUntilExpiration();
    return daysUntil >= 0 && daysUntil <= this._daysBeforeExpiration;
  }

  daysUntilExpiration(): number {
    if (!this._expirationDate) return Infinity;
    const diffMs = this._expirationDate.getTime() - new Date().getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  markAsExpired(): void {
    this._status = DocumentStatus.EXPIRED;
    this.touch();
  }

  renew(newIssueDate: Date, newExpirationDate: Date): void {
    this._issueDate = newIssueDate;
    this._expirationDate = newExpirationDate;
    this._status = DocumentStatus.VALID;
    this.touch();
  }
}
