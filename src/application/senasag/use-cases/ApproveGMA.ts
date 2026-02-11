import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { ApproveGMAInputDTO, GMAResponseDTO } from '../dtos/SenasagDTOs';
import { GMAMapper } from '../mappers/GMAMapper';

export class ApproveGMA implements IUseCase<ApproveGMAInputDTO, GMAResponseDTO> {
  constructor(
    private readonly gmaRepository: IGMARepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: ApproveGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    try {
      const gma = await this.gmaRepository.findById(new UniqueId(input.gmaId));
      if (!gma) {
        return Result.fail<GMAResponseDTO>('GMA not found');
      }

      if (!gma.canBeIssued()) {
        return Result.fail<GMAResponseDTO>('GMA cannot be approved in its current status');
      }

      // Validate GMA code uniqueness
      const existingByCode = await this.gmaRepository.findByGMACode(input.gmaCode);
      if (existingByCode) {
        return Result.fail<GMAResponseDTO>('A GMA with this code already exists');
      }

      gma.approve(input.gmaCode, new Date(input.issueDate));

      const saved = await this.gmaRepository.update(gma);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<GMAResponseDTO>(GMAMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error approving GMA';
      return Result.fail<GMAResponseDTO>(message);
    }
  }
}
