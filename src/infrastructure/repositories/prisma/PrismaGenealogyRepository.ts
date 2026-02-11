import { IGenealogyRepository } from '../../../domain/animals/repositories/IGenealogyRepository';
import { Genealogy } from '../../../domain/animals/entities/Genealogy';
import { UniqueId } from '../../../domain/shared/Entity';
import { RelationType } from '../../../domain/animals/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaGenealogyRepository
  extends PrismaBaseRepository
  implements IGenealogyRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaGenealogyRepository');
  }

  async findByAnimal(animalId: UniqueId): Promise<Genealogy[]> {
    try {
      const records = await (this.prisma as any).genealogy.findMany({
        where: { animalId: animalId.value },
        orderBy: { generation: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByGeneration(animalId: UniqueId, generation: number): Promise<Genealogy[]> {
    try {
      const records = await (this.prisma as any).genealogy.findMany({
        where: { animalId: animalId.value, generation },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findCommonAncestors(animal1Id: UniqueId, animal2Id: UniqueId): Promise<Genealogy[]> {
    try {
      const ancestors1 = await (this.prisma as any).genealogy.findMany({
        where: { animalId: animal1Id.value },
      });
      const ancestorIds1 = ancestors1.map((a: any) => a.ancestorId);

      const records = await (this.prisma as any).genealogy.findMany({
        where: {
          animalId: animal2Id.value,
          ancestorId: { in: ancestorIds1 },
        },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(genealogy: Genealogy): Promise<Genealogy> {
    try {
      const record = await (this.prisma as any).genealogy.create({
        data: {
          id: genealogy.id.value,
          animalId: genealogy.animalId.value,
          ancestorId: genealogy.ancestorId.value,
          relationType: genealogy.relationType,
          generation: genealogy.generation,
          inbreedingCoefficient: genealogy.inbreedingCoefficient,
          createdAt: genealogy.createdAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async bulkCreate(genealogies: Genealogy[]): Promise<Genealogy[]> {
    try {
      const data = genealogies.map((g) => ({
        id: g.id.value,
        animalId: g.animalId.value,
        ancestorId: g.ancestorId.value,
        relationType: g.relationType,
        generation: g.generation,
        inbreedingCoefficient: g.inbreedingCoefficient,
        createdAt: g.createdAt,
      }));
      await (this.prisma as any).genealogy.createMany({ data });
      const ids = genealogies.map((g) => g.id.value);
      const records = await (this.prisma as any).genealogy.findMany({
        where: { id: { in: ids } },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): Genealogy {
    return Genealogy.create(
      {
        animalId: new UniqueId(record.animalId),
        ancestorId: new UniqueId(record.ancestorId),
        relationType: record.relationType as RelationType,
        generation: record.generation,
        inbreedingCoefficient: record.inbreedingCoefficient ?? undefined,
      },
      new UniqueId(record.id),
      record.createdAt,
    );
  }
}
