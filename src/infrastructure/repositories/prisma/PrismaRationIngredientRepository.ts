import { IRationIngredientRepository } from '../../../application/health/services/IRationIngredientRepository';
import { RationIngredient } from '../../../domain/health/entities/RationIngredient';
import { UniqueId } from '../../../domain/shared/Entity';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaRationIngredientRepository
  extends PrismaBaseRepository
  implements IRationIngredientRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaRationIngredientRepository');
  }

  async findByRation(rationId: UniqueId): Promise<RationIngredient[]> {
    try {
      const records = await (this.prisma as any).rationIngredient.findMany({
        where: this.buildWhereWithSoftDelete({ rationId: rationId.value }),
        orderBy: { order: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(ingredient: RationIngredient): Promise<RationIngredient> {
    try {
      const data = this.toPersistence(ingredient);
      const record = await (this.prisma as any).rationIngredient.create({ data });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).rationIngredient.update({
        where: { id: id.value },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): RationIngredient {
    return RationIngredient.create({
      rationId: new UniqueId(record.rationId),
      productId: new UniqueId(record.productId),
      percentage: record.percentage,
      kgPerTon: record.kgPerTon,
      order: record.order,
    }, new UniqueId(record.id));
  }

  private toPersistence(ingredient: RationIngredient): any {
    return {
      id: ingredient.id?.value,
      rationId: ingredient.rationId.value,
      productId: ingredient.productId.value,
      percentage: ingredient.percentage,
      kgPerTon: ingredient.kgPerTon,
      order: ingredient.order,
    };
  }
}
