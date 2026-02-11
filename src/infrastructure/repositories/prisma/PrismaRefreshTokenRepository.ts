import { IRefreshTokenRepository } from '../../../domain/auth/repositories/IRefreshTokenRepository';
import { RefreshToken } from '../../../domain/auth/entities/RefreshToken';
import { UniqueId } from '../../../domain/shared/Entity';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaRefreshTokenRepository
  extends PrismaBaseRepository
  implements IRefreshTokenRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaRefreshTokenRepository');
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    try {
      const record = await (this.prisma as any).refreshToken.findFirst({
        where: { token },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByUserId(userId: UniqueId): Promise<RefreshToken[]> {
    try {
      const records = await (this.prisma as any).refreshToken.findMany({
        where: { userId: userId.value },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(token: RefreshToken): Promise<RefreshToken> {
    try {
      const record = await (this.prisma as any).refreshToken.create({
        data: {
          id: token.id.value,
          token: token.token,
          userId: token.userId.value,
          expiresAt: token.expiresAt,
          revokedAt: token.revokedAt,
          createdAt: token.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async revoke(token: string): Promise<void> {
    try {
      await (this.prisma as any).refreshToken.updateMany({
        where: { token, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async revokeAllByUser(userId: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).refreshToken.updateMany({
        where: { userId: userId.value, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteExpired(): Promise<void> {
    try {
      await (this.prisma as any).refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): RefreshToken {
    return RefreshToken.create(
      {
        token: record.token,
        userId: new UniqueId(record.userId),
        expiresAt: new Date(record.expiresAt),
        revokedAt: record.revokedAt ? new Date(record.revokedAt) : undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
    );
  }
}
