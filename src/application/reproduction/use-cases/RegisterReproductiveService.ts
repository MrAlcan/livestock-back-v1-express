import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ReproductionCycle } from '../../../domain/reproduction/entities';
import { ReproductionResult } from '../../../domain/events/enums';
import { BirthProjectionService } from '../../../domain/reproduction/services';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { RegisterReproductiveServiceInputDTO, ReproductiveCycleResponseDTO } from '../dtos/ReproductionDTOs';
import { ReproductionCycleMapper } from '../mappers/ReproductionCycleMapper';
import { IReproductionCycleRepository } from '../services/IReproductionCycleRepository';

export class RegisterReproductiveService
  implements IUseCase<RegisterReproductiveServiceInputDTO, ReproductiveCycleResponseDTO>
{
  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
    private readonly birthProjectionService: BirthProjectionService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    input: RegisterReproductiveServiceInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    try {
      const femaleId = new UniqueId(input.femaleId);
      const serviceDate = new Date(input.serviceDate);

      if (serviceDate > new Date()) {
        return Result.fail<ReproductiveCycleResponseDTO>('Service date cannot be in the future');
      }

      // Check if the female already has an active (non-concluded) cycle
      const existingCycles = await this.reproductionCycleRepository.findByFemale(femaleId);
      const activeCycle = existingCycles.find(
        (c) => c.result === ReproductionResult.PREGNANT || c.result === ReproductionResult.SERVICED,
      );

      if (activeCycle) {
        return Result.fail<ReproductiveCycleResponseDTO>(
          'Female already has an active reproductive cycle',
        );
      }

      const estimatedBirthDate = this.birthProjectionService.projectBirthDateFromService(serviceDate);

      const cycle: ReproductionCycle = {
        femaleId,
        studId: input.studId ? new UniqueId(input.studId) : undefined,
        serviceDate,
        serviceType: input.serviceType,
        result: ReproductionResult.SERVICED,
        estimatedBirthDate,
      };

      const saved = await this.reproductionCycleRepository.create(cycle);

      return Result.ok<ReproductiveCycleResponseDTO>(ReproductionCycleMapper.toDTO(saved));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error registering reproductive service';
      return Result.fail<ReproductiveCycleResponseDTO>(message);
    }
  }
}
