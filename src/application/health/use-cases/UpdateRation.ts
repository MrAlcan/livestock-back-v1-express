import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Ration } from '../../../domain/health/entities/Ration';
import { IRationRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateRationInputDTO, RationResponseDTO } from '../dtos/HealthDTOs';
import { RationMapper } from '../mappers/RationMapper';

export class UpdateRation implements IUseCase<UpdateRationInputDTO, RationResponseDTO> {
  constructor(
    private readonly rationRepository: IRationRepository,
  ) {}

  async execute(input: UpdateRationInputDTO): Promise<Result<RationResponseDTO>> {
    try {
      const ration = await this.rationRepository.findById(new UniqueId(input.id));
      if (!ration) {
        return Result.fail<RationResponseDTO>('Ration not found');
      }

      const updatedRation = Ration.create(
        {
          code: ration.code,
          name: input.name !== undefined ? input.name : ration.name,
          type: ration.type,
          farmId: ration.farmId,
          description: input.description !== undefined ? input.description : ration.description,
          dryMatterPct: input.dryMatterPct !== undefined ? input.dryMatterPct : ration.dryMatterPct,
          proteinPct: input.proteinPct !== undefined ? input.proteinPct : ration.proteinPct,
          energyMcalKg: input.energyMcalKg !== undefined ? input.energyMcalKg : ration.energyMcalKg,
          costPerTon: input.costPerTon !== undefined ? input.costPerTon : ration.costPerTon,
          estimatedConversion: input.estimatedConversion !== undefined ? input.estimatedConversion : ration.estimatedConversion,
          active: ration.active,
        },
        ration.id,
        ration.createdAt,
      );

      const saved = await this.rationRepository.update(updatedRation);
      return Result.ok<RationResponseDTO>(RationMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating ration';
      return Result.fail<RationResponseDTO>(message);
    }
  }
}
