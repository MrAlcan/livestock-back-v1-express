import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Paddock } from '../../../domain/lots/entities/Paddock';
import { IPaddockRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdatePaddockInputDTO, PaddockResponseDTO } from '../dtos/LotDTOs';
import { PaddockMapper } from '../mappers/PaddockMapper';

export class UpdatePaddock implements IUseCase<UpdatePaddockInputDTO, PaddockResponseDTO> {
  constructor(
    private readonly paddockRepository: IPaddockRepository,
  ) {}

  async execute(input: UpdatePaddockInputDTO): Promise<Result<PaddockResponseDTO>> {
    try {
      const paddock = await this.paddockRepository.findById(new UniqueId(input.id));
      if (!paddock) {
        return Result.fail<PaddockResponseDTO>('Paddock not found');
      }

      const updated = Paddock.create(
        {
          code: paddock.code,
          name: input.name !== undefined ? input.name : paddock.name,
          hectares: input.hectares !== undefined ? input.hectares : paddock.hectares,
          maxCapacityAU: input.maxCapacityAU !== undefined ? input.maxCapacityAU : paddock.maxCapacityAU,
          pastureType: input.pastureType !== undefined ? input.pastureType : paddock.pastureType,
          pastureCondition: input.pastureCondition !== undefined ? input.pastureCondition : paddock.pastureCondition,
          lastSeedingDate: paddock.lastSeedingDate,
          recommendedRestDays: paddock.recommendedRestDays,
          lastEntryDate: paddock.lastEntryDate,
          location: paddock.location,
          hasWater: paddock.hasWater,
          hasShade: paddock.hasShade,
          farmId: paddock.farmId,
          observations: input.observations !== undefined ? input.observations : paddock.observations,
          deletedAt: paddock.deletedAt,
        },
        paddock.id,
        paddock.createdAt,
      );

      const saved = await this.paddockRepository.update(updated);

      return Result.ok<PaddockResponseDTO>(PaddockMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating paddock';
      return Result.fail<PaddockResponseDTO>(message);
    }
  }
}
