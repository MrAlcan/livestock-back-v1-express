import { IUserRepository, UserFilters } from '../../../domain/auth/repositories/IUserRepository';
import { User } from '../../../domain/auth/entities/User';
import { UniqueId } from '../../../domain/shared/Entity';
import { Pagination } from '../../../domain/shared/Pagination';
import { Email } from '../../../domain/auth/value-objects/Email';
import { UserStatus } from '../../../domain/auth/enums/UserStatus';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaUserRepository
  extends PrismaBaseRepository
  implements IUserRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaUserRepository');
  }

  async findById(id: UniqueId): Promise<User | null> {
    try {
      const record = await (this.prisma as any).user.findUnique({
        where: this.buildWhereWithSoftDelete({ id: id.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    try {
      const record = await (this.prisma as any).user.findFirst({
        where: this.buildWhereWithSoftDelete({ email: email.value }),
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(filters: UserFilters, pagination: Pagination): Promise<User[]> {
    try {
      const where = this.buildWhereWithSoftDelete(this.buildFilters(filters));
      const records = await (this.prisma as any).user.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const record = await (this.prisma as any).user.create({
        data: {
          id: user.id.value,
          fullName: user.fullName,
          email: user.email.value,
          passwordHash: user.passwordHash,
          roleId: user.roleId,
          farmId: user.farmId.value,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          status: user.status,
          lastAccess: user.lastAccess,
          lastAccessIp: user.lastAccessIp,
          preferences: user.preferences,
          recoveryToken: user.recoveryToken,
          tokenExpiration: user.tokenExpiration,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(user: User): Promise<User> {
    try {
      const record = await (this.prisma as any).user.update({
        where: { id: user.id.value },
        data: {
          fullName: user.fullName,
          email: user.email.value,
          passwordHash: user.passwordHash,
          roleId: user.roleId,
          farmId: user.farmId.value,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          status: user.status,
          lastAccess: user.lastAccess,
          lastAccessIp: user.lastAccessIp,
          preferences: user.preferences,
          recoveryToken: user.recoveryToken,
          tokenExpiration: user.tokenExpiration,
          updatedAt: user.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).user.update({
        where: { id: id.value },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async assignRole(userId: UniqueId, roleId: number): Promise<void> {
    try {
      await (this.prisma as any).user.update({
        where: { id: userId.value },
        data: { roleId },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async removeRole(userId: UniqueId, roleId: number): Promise<void> {
    try {
      await (this.prisma as any).user.update({
        where: { id: userId.value },
        data: { roleId: null },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private buildFilters(filters: UserFilters): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.farmId) where.farmId = filters.farmId;
    if (filters.roleId) where.roleId = filters.roleId;
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private toDomain(record: any): User {
    return User.create(
      {
        fullName: record.fullName,
        email: Email.create(record.email),
        passwordHash: record.passwordHash,
        roleId: record.roleId,
        farmId: new UniqueId(record.farmId),
        phone: record.phone ?? undefined,
        avatarUrl: record.avatarUrl ?? undefined,
        status: record.status as UserStatus,
        lastAccess: record.lastAccess ? new Date(record.lastAccess) : undefined,
        lastAccessIp: record.lastAccessIp ?? undefined,
        preferences: record.preferences ?? {},
        recoveryToken: record.recoveryToken ?? undefined,
        tokenExpiration: record.tokenExpiration ? new Date(record.tokenExpiration) : undefined,
        deletedAt: record.deletedAt ? new Date(record.deletedAt) : undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
