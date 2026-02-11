import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { Breed } from '../../../domain/animals/entities/Breed';
import { BreedAptitude } from '../../../domain/animals/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaBreedRepository
  extends PrismaBaseRepository
  implements IBreedRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaBreedRepository');
  }

  async findById(id: number): Promise<Breed | null> {
    try {
      const record = await (this.prisma as any).breed.findUnique({
        where: { id },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByCode(code: string): Promise<Breed | null> {
    try {
      const record = await (this.prisma as any).breed.findFirst({
        where: { code },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<Breed[]> {
    try {
      const records = await (this.prisma as any).breed.findMany({
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findActive(): Promise<Breed[]> {
    try {
      const records = await (this.prisma as any).breed.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(breed: Breed): Promise<Breed> {
    try {
      const record = await (this.prisma as any).breed.create({
        data: {
          id: breed.id,
          code: breed.code,
          name: breed.name,
          description: breed.description,
          origin: breed.origin,
          averageAdultWeight: breed.averageAdultWeight,
          aptitude: breed.aptitude,
          active: breed.active,
          createdAt: breed.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(breed: Breed): Promise<Breed> {
    try {
      const record = await (this.prisma as any).breed.update({
        where: { id: breed.id },
        data: {
          code: breed.code,
          name: breed.name,
          description: breed.description,
          origin: breed.origin,
          averageAdultWeight: breed.averageAdultWeight,
          aptitude: breed.aptitude,
          active: breed.active,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await (this.prisma as any).breed.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): Breed {
    return Breed.create({
      id: record.id,
      code: record.code,
      name: record.name,
      description: record.description ?? undefined,
      origin: record.origin ?? undefined,
      averageAdultWeight: record.averageAdultWeight ?? undefined,
      aptitude: record.aptitude ? (record.aptitude as BreedAptitude) : undefined,
      active: record.active,
      createdAt: new Date(record.createdAt),
    });
  }
}
