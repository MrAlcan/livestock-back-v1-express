import { UniqueId } from '../../shared/Entity';
import { RefreshToken } from '../entities/RefreshToken';

export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: UniqueId): Promise<RefreshToken[]>;
  create(token: RefreshToken): Promise<RefreshToken>;
  revoke(token: string): Promise<void>;
  revokeAllByUser(userId: UniqueId): Promise<void>;
  deleteExpired(): Promise<void>;
}
