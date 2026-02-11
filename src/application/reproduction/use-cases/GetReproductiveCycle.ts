import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IUseCase } from '../../shared/types/IUseCase';
import { ReproductiveCycleResponseDTO } from '../dtos/ReproductionDTOs';
import { ReproductionCycleMapper } from '../mappers/ReproductionCycleMapper';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

interface GetReproductiveCycleInputDTO {
  readonly femaleId: string;
}

export class GetReproductiveCycle
  implements IUseCase<GetReproductiveCycleInputDTO, ReproductiveCycleResponseDTO[]>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
  ) {}

  async execute(
    input: GetReproductiveCycleInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO[]>> {
    try {
      const femaleId = new UniqueId(input.femaleId);
      const cycles = await this.reproductionCycleRepository.findByFemale(femaleId);

      const dtos = cycles.map(ReproductionCycleMapper.toDTO);

      return Result.ok<ReproductiveCycleResponseDTO[]>(dtos);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error retrieving reproductive cycles';
      return Result.fail<ReproductiveCycleResponseDTO[]>(message);
    }
  }
}
