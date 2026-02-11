import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Paddock } from '../../../domain/lots/entities/Paddock';
import { IPaddockRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreatePaddockInputDTO, PaddockResponseDTO } from '../dtos/LotDTOs';
import { PaddockMapper } from '../mappers/PaddockMapper';

export class CreatePaddock implements IUseCase<CreatePaddockInputDTO, PaddockResponseDTO> {
  constructor(
    private readonly paddockRepository: IPaddockRepository,
  ) {}

  async execute(input: CreatePaddockInputDTO): Promise<Result<PaddockResponseDTO>> {
    try {
      const farmId = new UniqueId(input.farmId);

      // Check for duplicate code within the farm
      const existing = await this.paddockRepository.findByCode(input.code, farmId);
      if (existing) {
        return Result.fail<PaddockResponseDTO>('A paddock with this code already exists in this farm');
      }

      const paddock = Paddock.create({
        code: input.code,
        name: input.name,
        hectares: input.hectares,
        maxCapacityAU: input.maxCapacityAU,
        pastureType: input.pastureType,
        pastureCondition: input.pastureCondition,
        lastSeedingDate: input.lastSeedingDate ? new Date(input.lastSeedingDate) : undefined,
        recommendedRestDays: input.recommendedRestDays,
        hasWater: input.hasWater,
        hasShade: input.hasShade,
        farmId,
        observations: input.observations,
      });

      const saved = await this.paddockRepository.create(paddock);

      return Result.ok<PaddockResponseDTO>(PaddockMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating paddock';
      return Result.fail<PaddockResponseDTO>(message);
    }
  }
}
