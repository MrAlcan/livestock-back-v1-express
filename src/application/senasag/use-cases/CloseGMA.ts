import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { CloseGMAInputDTO, GMAResponseDTO } from '../dtos/SenasagDTOs';
import { GMAMapper } from '../mappers/GMAMapper';

export class CloseGMA implements IUseCase<CloseGMAInputDTO, GMAResponseDTO> {
  constructor(
    private readonly gmaRepository: IGMARepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: CloseGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    try {
      const gma = await this.gmaRepository.findById(new UniqueId(input.gmaId));
      if (!gma) {
        return Result.fail<GMAResponseDTO>('GMA not found');
      }

      if (!gma.isInTransit()) {
        return Result.fail<GMAResponseDTO>('Only in-transit GMAs can be closed');
      }

      if (input.actualTotalWeight <= 0) {
        return Result.fail<GMAResponseDTO>('Actual total weight must be greater than zero');
      }

      gma.close(new Date(input.actualArrivalDate), input.actualTotalWeight);

      const saved = await this.gmaRepository.update(gma);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<GMAResponseDTO>(GMAMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error closing GMA';
      return Result.fail<GMAResponseDTO>(message);
    }
  }
}
