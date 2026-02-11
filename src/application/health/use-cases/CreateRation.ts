import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Ration } from '../../../domain/health/entities/Ration';
import { IRationRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreateRationInputDTO, RationResponseDTO } from '../dtos/HealthDTOs';
import { RationMapper } from '../mappers/RationMapper';

export class CreateRation implements IUseCase<CreateRationInputDTO, RationResponseDTO> {
  constructor(
    private readonly rationRepository: IRationRepository,
  ) {}

  async execute(input: CreateRationInputDTO): Promise<Result<RationResponseDTO>> {
    try {
      const farmId = new UniqueId(input.farmId);

      const existingRation = await this.rationRepository.findByCode(input.code, farmId);
      if (existingRation) {
        return Result.fail<RationResponseDTO>('A ration with this code already exists for this farm');
      }

      const ration = Ration.create({
        code: input.code,
        name: input.name,
        type: input.type,
        farmId,
        description: input.description,
        dryMatterPct: input.dryMatterPct,
        proteinPct: input.proteinPct,
        energyMcalKg: input.energyMcalKg,
        costPerTon: input.costPerTon,
        estimatedConversion: input.estimatedConversion,
        active: true,
      });

      const saved = await this.rationRepository.create(ration);
      return Result.ok<RationResponseDTO>(RationMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating ration';
      return Result.fail<RationResponseDTO>(message);
    }
  }
}
