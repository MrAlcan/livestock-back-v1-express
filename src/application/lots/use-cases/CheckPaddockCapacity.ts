import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IPaddockRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaddockCapacityResponseDTO } from '../dtos/LotDTOs';

interface CheckPaddockCapacityInputDTO {
  readonly paddockId: string;
  readonly requestedQuantity: number;
}

export class CheckPaddockCapacity implements IUseCase<CheckPaddockCapacityInputDTO, PaddockCapacityResponseDTO> {
  constructor(
    private readonly paddockRepository: IPaddockRepository,
  ) {}

  async execute(input: CheckPaddockCapacityInputDTO): Promise<Result<PaddockCapacityResponseDTO>> {
    try {
      const paddock = await this.paddockRepository.findById(new UniqueId(input.paddockId));
      if (!paddock) {
        return Result.fail<PaddockCapacityResponseDTO>('Paddock not found');
      }

      const maxCapacity = paddock.maxCapacityAU;
      const currentOccupancy = 0; // Would need to be calculated from assigned animals
      const availableSpace = maxCapacity !== undefined ? maxCapacity - currentOccupancy : undefined;
      const canReceive = paddock.canReceiveAnimals(input.requestedQuantity + currentOccupancy);

      const capacity: PaddockCapacityResponseDTO = {
        paddockId: paddock.id.value,
        maxCapacity,
        currentOccupancy,
        availableSpace,
        canReceive,
      };

      return Result.ok<PaddockCapacityResponseDTO>(capacity);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error checking paddock capacity';
      return Result.fail<PaddockCapacityResponseDTO>(message);
    }
  }
}
