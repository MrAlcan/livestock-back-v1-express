import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ILotRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { LotResponseDTO } from '../dtos/LotDTOs';
import { LotMapper } from '../mappers/LotMapper';

interface CloseLotInputDTO {
  readonly id: string;
}

export class CloseLot implements IUseCase<CloseLotInputDTO, LotResponseDTO> {
  constructor(
    private readonly lotRepository: ILotRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: CloseLotInputDTO): Promise<Result<LotResponseDTO>> {
    try {
      const lot = await this.lotRepository.findById(new UniqueId(input.id));
      if (!lot) {
        return Result.fail<LotResponseDTO>('Lot not found');
      }

      if (lot.isClosed()) {
        return Result.fail<LotResponseDTO>('Lot is already closed');
      }

      lot.close();

      const saved = await this.lotRepository.update(lot);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<LotResponseDTO>(LotMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error closing lot';
      return Result.fail<LotResponseDTO>(message);
    }
  }
}
