import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IUseCase } from '../../shared/types/IUseCase';
import { ReproductiveCycleResponseDTO } from '../dtos/ReproductionDTOs';
import { ReproductionCycleMapper } from '../mappers/ReproductionCycleMapper';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

interface ListActiveReproductiveCyclesInputDTO {
  readonly farmId: string;
}

export class ListActiveReproductiveCycles
  implements IUseCase<ListActiveReproductiveCyclesInputDTO, ReproductiveCycleResponseDTO[]>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
  ) {}

  async execute(
    input: ListActiveReproductiveCyclesInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO[]>> {
    try {
      const farmId = new UniqueId(input.farmId);
      const activeCycles = await this.reproductionCycleRepository.findActiveCycles(farmId);

      const dtos = activeCycles.map(ReproductionCycleMapper.toDTO);

      return Result.ok<ReproductiveCycleResponseDTO[]>(dtos);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error listing active reproductive cycles';
      return Result.fail<ReproductiveCycleResponseDTO[]>(message);
    }
  }
}
