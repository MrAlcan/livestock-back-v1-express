import { AggregateRoot } from '../../shared/AggregateRoot';
import { UniqueId } from '../../shared/Entity';
import { Email } from '../value-objects/Email';
import { UserStatus } from '../enums/UserStatus';

interface UserProps {
  fullName: string;
  email: Email;
  passwordHash: string;
  roleId: number;
  farmId: UniqueId;
  phone?: string;
  avatarUrl?: string;
  status: UserStatus;
  lastAccess?: Date;
  lastAccessIp?: string;
  preferences?: Record<string, unknown>;
  recoveryToken?: string;
  tokenExpiration?: Date;
  deletedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  private _fullName: string;
  private _email: Email;
  private _passwordHash: string;
  private _roleId: number;
  private _farmId: UniqueId;
  private _phone?: string;
  private _avatarUrl?: string;
  private _status: UserStatus;
  private _lastAccess?: Date;
  private _lastAccessIp?: string;
  private _preferences: Record<string, unknown>;
  private _recoveryToken?: string;
  private _tokenExpiration?: Date;
  private _deletedAt?: Date;

  private constructor(props: UserProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._fullName = props.fullName;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._roleId = props.roleId;
    this._farmId = props.farmId;
    this._phone = props.phone;
    this._avatarUrl = props.avatarUrl;
    this._status = props.status;
    this._lastAccess = props.lastAccess;
    this._lastAccessIp = props.lastAccessIp;
    this._preferences = props.preferences ?? {};
    this._recoveryToken = props.recoveryToken;
    this._tokenExpiration = props.tokenExpiration;
    this._deletedAt = props.deletedAt;
  }

  static create(props: UserProps, id?: UniqueId, createdAt?: Date, updatedAt?: Date): User {
    if (!props.fullName || props.fullName.trim().length === 0) {
      throw new Error('User fullName is required');
    }
    if (!props.passwordHash && props.status === UserStatus.ACTIVE) {
      throw new Error('Active user must have a password');
    }
    return new User(props, id, createdAt, updatedAt);
  }

  get fullName(): string { return this._fullName; }
  get email(): Email { return this._email; }
  get passwordHash(): string { return this._passwordHash; }
  get roleId(): number { return this._roleId; }
  get farmId(): UniqueId { return this._farmId; }
  get phone(): string | undefined { return this._phone; }
  get avatarUrl(): string | undefined { return this._avatarUrl; }
  get status(): UserStatus { return this._status; }
  get lastAccess(): Date | undefined { return this._lastAccess; }
  get lastAccessIp(): string | undefined { return this._lastAccessIp; }
  get preferences(): Record<string, unknown> { return { ...this._preferences }; }
  get recoveryToken(): string | undefined { return this._recoveryToken; }
  get tokenExpiration(): Date | undefined { return this._tokenExpiration; }
  get deletedAt(): Date | undefined { return this._deletedAt; }

  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  canAccessFarm(farmId: UniqueId): boolean {
    return this._farmId.equals(farmId);
  }

  updateLastAccess(ip: string): void {
    this._lastAccess = new Date();
    this._lastAccessIp = ip;
    this.touch();
  }

  changePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }
    this._passwordHash = newPasswordHash;
    this._recoveryToken = undefined;
    this._tokenExpiration = undefined;
    this.touch();
  }

  deactivate(): void {
    this._status = UserStatus.INACTIVE;
    this.touch();
  }

  activate(): void {
    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  block(): void {
    this._status = UserStatus.BLOCKED;
    this.touch();
  }

  setRecoveryToken(token: string, expiration: Date): void {
    this._recoveryToken = token;
    this._tokenExpiration = expiration;
    this.touch();
  }
}
