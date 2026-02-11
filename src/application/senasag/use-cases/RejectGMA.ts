import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { RejectGMAInputDTO, GMAResponseDTO } from '../dtos/SenasagDTOs';
import { GMAMapper } from '../mappers/GMAMapper';

export class RejectGMA implements IUseCase<RejectGMAInputDTO, GMAResponseDTO> {
  constructor(
    private readonly gmaRepository: IGMARepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: RejectGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    try {
      const gma = await this.gmaRepository.findById(new UniqueId(input.gmaId));
      if (!gma) {
        return Result.fail<GMAResponseDTO>('GMA not found');
      }

      if (!gma.isPending()) {
        return Result.fail<GMAResponseDTO>('Only pending GMAs can be rejected');
      }

      if (!input.rejectionReason || input.rejectionReason.trim().length === 0) {
        return Result.fail<GMAResponseDTO>('Rejection reason is required');
      }

      gma.reject(input.rejectionReason);

      const saved = await this.gmaRepository.update(gma);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<GMAResponseDTO>(GMAMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error rejecting GMA';
      return Result.fail<GMAResponseDTO>(message);
    }
  }
}
