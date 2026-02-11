import { UniqueId } from '../../../domain/shared/Entity';
import { IRefreshTokenRepository } from '../../../domain/auth/repositories/IRefreshTokenRepository';
import { RefreshToken } from '../../../domain/auth/entities/RefreshToken';

export class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
  private items: Map<string, RefreshToken> = new Map();

  async findByToken(token: string): Promise<RefreshToken | null> {
    const all = Array.from(this.items.values());
    return all.find((rt) => rt.token === token) ?? null;
  }

  async findByUserId(userId: UniqueId): Promise<RefreshToken[]> {
    return Array.from(this.items.values()).filter(
      (rt) => rt.userId.value === userId.value,
    );
  }

  async create(token: RefreshToken): Promise<RefreshToken> {
    this.items.set(token.id.value, token);
    return token;
  }

  async revoke(token: string): Promise<void> {
    const all = Array.from(this.items.values());
    const found = all.find((rt) => rt.token === token);
    if (found) {
      found.revoke();
    }
  }

  async revokeAllByUser(userId: UniqueId): Promise<void> {
    const all = Array.from(this.items.values());
    for (const rt of all) {
      if (rt.userId.value === userId.value && !rt.isRevoked()) {
        rt.revoke();
      }
    }
  }

  async deleteExpired(): Promise<void> {
    const all = Array.from(this.items.entries());
    for (const [key, rt] of all) {
      if (rt.isExpired()) {
        this.items.delete(key);
      }
    }
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): RefreshToken[] {
    return Array.from(this.items.values());
  }
}
