import { IPermissionRepository } from '../../../domain/auth/repositories/IPermissionRepository';
import { Permission } from '../../../domain/auth/entities/Permission';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaPermissionRepository
  extends PrismaBaseRepository
  implements IPermissionRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaPermissionRepository');
  }

  async findById(id: number): Promise<Permission | null> {
    try {
      const record = await (this.prisma as any).permission.findUnique({
        where: { id },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string): Promise<Permission | null> {
    try {
      const record = await (this.prisma as any).permission.findFirst({
        where: { code },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByModule(module: string): Promise<Permission[]> {
    try {
      const records = await (this.prisma as any).permission.findMany({
        where: { module },
        orderBy: { code: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<Permission[]> {
    try {
      const records = await (this.prisma as any).permission.findMany({
        orderBy: { code: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(permission: Permission): Promise<Permission> {
    try {
      const record = await (this.prisma as any).permission.create({
        data: {
          id: permission.id,
          code: permission.code,
          module: permission.module,
          action: permission.action,
          description: permission.description,
          createdAt: permission.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(permission: Permission): Promise<Permission> {
    try {
      const record = await (this.prisma as any).permission.update({
        where: { id: permission.id },
        data: {
          code: permission.code,
          module: permission.module,
          action: permission.action,
          description: permission.description,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await (this.prisma as any).permission.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): Permission {
    return Permission.create({
      id: record.id,
      code: record.code,
      module: record.module,
      action: record.action,
      description: record.description ?? undefined,
      createdAt: new Date(record.createdAt),
    });
  }
}
