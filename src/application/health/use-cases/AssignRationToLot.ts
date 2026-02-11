import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Lot } from '../../../domain/lots/entities/Lot';
import { IRationRepository } from '../../../domain/health/repositories';
import { ILotRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';

interface AssignRationToLotInput {
  readonly rationId: string;
  readonly lotId: string;
}

interface AssignRationToLotOutput {
  readonly lotId: string;
  readonly rationId: string;
  readonly success: boolean;
}

export class AssignRationToLot implements IUseCase<AssignRationToLotInput, AssignRationToLotOutput> {
  constructor(
    private readonly rationRepository: IRationRepository,
    private readonly lotRepository: ILotRepository,
  ) {}

  async execute(input: AssignRationToLotInput): Promise<Result<AssignRationToLotOutput>> {
    try {
      const rationId = new UniqueId(input.rationId);
      const lotId = new UniqueId(input.lotId);

      const ration = await this.rationRepository.findById(rationId);
      if (!ration) {
        return Result.fail<AssignRationToLotOutput>('Ration not found');
      }

      if (!ration.active) {
        return Result.fail<AssignRationToLotOutput>('Cannot assign an inactive ration');
      }

      const lot = await this.lotRepository.findById(lotId);
      if (!lot) {
        return Result.fail<AssignRationToLotOutput>('Lot not found');
      }

      if (!lot.isActive()) {
        return Result.fail<AssignRationToLotOutput>('Cannot assign ration to a non-active lot');
      }

      // Reconstruct lot with the assigned ration
      const updatedLot = Lot.create(
        {
          code: lot.code,
          name: lot.name,
          type: lot.type,
          farmId: lot.farmId,
          description: lot.description,
          creationDate: lot.creationDate,
          closureDate: lot.closureDate,
          status: lot.status,
          currentQuantity: lot.currentQuantity,
          currentAverageWeight: lot.currentAverageWeight,
          targetWeight: lot.targetWeight,
          targetDays: lot.targetDays,
          assignedRationId: rationId,
          deletedAt: lot.deletedAt,
        },
        lot.id,
        lot.createdAt,
      );

      await this.lotRepository.update(updatedLot);

      return Result.ok<AssignRationToLotOutput>({
        lotId: input.lotId,
        rationId: input.rationId,
        success: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error assigning ration to lot';
      return Result.fail<AssignRationToLotOutput>(message);
    }
  }
}
