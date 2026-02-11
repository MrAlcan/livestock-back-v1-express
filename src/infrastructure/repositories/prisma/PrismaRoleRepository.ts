import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { Role } from '../../../domain/auth/entities/Role';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaRoleRepository
  extends PrismaBaseRepository
  implements IRoleRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaRoleRepository');
  }

  async findById(id: number): Promise<Role | null> {
    try {
      const record = await (this.prisma as any).role.findUnique({
        where: { id },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string): Promise<Role | null> {
    try {
      const record = await (this.prisma as any).role.findFirst({
        where: { code },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      const records = await (this.prisma as any).role.findMany({
        orderBy: { accessLevel: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(role: Role): Promise<Role> {
    try {
      const record = await (this.prisma as any).role.create({
        data: {
          id: role.id,
          code: role.code,
          name: role.name,
          description: role.description,
          accessLevel: role.accessLevel,
          permissions: role.permissions,
          isSystem: role.isSystem,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(role: Role): Promise<Role> {
    try {
      const record = await (this.prisma as any).role.update({
        where: { id: role.id },
        data: {
          code: role.code,
          name: role.name,
          description: role.description,
          accessLevel: role.accessLevel,
          permissions: role.permissions,
          updatedAt: role.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await (this.prisma as any).role.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): Role {
    return Role.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description ?? undefined,
      accessLevel: record.accessLevel,
      permissions: record.permissions ?? {},
      isSystem: record.isSystem,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }
}
