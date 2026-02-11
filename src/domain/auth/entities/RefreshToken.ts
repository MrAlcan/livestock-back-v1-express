import { Entity, UniqueId } from '../../shared/Entity';

interface RefreshTokenProps {
  token: string;
  userId: UniqueId;
  expiresAt: Date;
  revokedAt?: Date;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  private readonly _token: string;
  private readonly _userId: UniqueId;
  private readonly _expiresAt: Date;
  private _revokedAt?: Date;

  private constructor(props: RefreshTokenProps, id?: UniqueId, createdAt?: Date) {
    super(id, createdAt);
    this._token = props.token;
    this._userId = props.userId;
    this._expiresAt = props.expiresAt;
    this._revokedAt = props.revokedAt;
  }

  static create(props: RefreshTokenProps, id?: UniqueId, createdAt?: Date): RefreshToken {
    if (!props.token || props.token.trim().length === 0) {
      throw new Error('Token value is required');
    }
    return new RefreshToken(props, id, createdAt);
  }

  get token(): string { return this._token; }
  get userId(): UniqueId { return this._userId; }
  get expiresAt(): Date { return this._expiresAt; }
  get revokedAt(): Date | undefined { return this._revokedAt; }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  isRevoked(): boolean {
    return this._revokedAt !== undefined;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked();
  }

  revoke(): void {
    if (this._revokedAt) {
      throw new Error('Token is already revoked');
    }
    this._revokedAt = new Date();
  }
}
