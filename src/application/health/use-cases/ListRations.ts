import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IRationRepository } from '../../../domain/health/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { RationResponseDTO } from '../dtos/HealthDTOs';
import { RationMapper } from '../mappers/RationMapper';

interface ListRationsInput {
  readonly farmId: string;
  readonly activeOnly?: boolean;
}

export class ListRations implements IUseCase<ListRationsInput, RationResponseDTO[]> {
  constructor(
    private readonly rationRepository: IRationRepository,
  ) {}

  async execute(input: ListRationsInput): Promise<Result<RationResponseDTO[]>> {
    try {
      const farmId = new UniqueId(input.farmId);

      const rations = input.activeOnly
        ? await this.rationRepository.findActive(farmId)
        : await this.rationRepository.findByFarm(farmId);

      const dtos = rations.map(RationMapper.toDTO);

      return Result.ok<RationResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing rations';
      return Result.fail<RationResponseDTO[]>(message);
    }
  }
}
