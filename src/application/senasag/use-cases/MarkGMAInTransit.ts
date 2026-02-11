import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { MarkGMAInTransitInputDTO, GMAResponseDTO } from '../dtos/SenasagDTOs';
import { GMAMapper } from '../mappers/GMAMapper';

export class MarkGMAInTransit implements IUseCase<MarkGMAInTransitInputDTO, GMAResponseDTO> {
  constructor(
    private readonly gmaRepository: IGMARepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: MarkGMAInTransitInputDTO): Promise<Result<GMAResponseDTO>> {
    try {
      const gma = await this.gmaRepository.findById(new UniqueId(input.gmaId));
      if (!gma) {
        return Result.fail<GMAResponseDTO>('GMA not found');
      }

      // Check if GMA has expired before allowing transit
      if (gma.isExpired()) {
        return Result.fail<GMAResponseDTO>('GMA has expired and cannot be marked in transit');
      }

      gma.markInTransit(new Date(input.actualDepartureDate));

      const saved = await this.gmaRepository.update(gma);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<GMAResponseDTO>(GMAMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error marking GMA in transit';
      return Result.fail<GMAResponseDTO>(message);
    }
  }
}
