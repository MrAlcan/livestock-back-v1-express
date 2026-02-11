import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Lot } from '../../../domain/lots/entities/Lot';
import { LotStatus } from '../../../domain/lots/enums';
import { ILotRepository } from '../../../domain/lots/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { CreateLotInputDTO, LotResponseDTO } from '../dtos/LotDTOs';
import { LotMapper } from '../mappers/LotMapper';

export class CreateLot implements IUseCase<CreateLotInputDTO, LotResponseDTO> {
  constructor(
    private readonly lotRepository: ILotRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: CreateLotInputDTO): Promise<Result<LotResponseDTO>> {
    try {
      const farmId = new UniqueId(input.farmId);

      // Check for duplicate code within the farm
      const existing = await this.lotRepository.findByCode(input.code, farmId);
      if (existing) {
        return Result.fail<LotResponseDTO>('A lot with this code already exists in this farm');
      }

      const lot = Lot.create({
        code: input.code,
        name: input.name,
        type: input.type,
        description: input.description,
        targetWeight: input.targetWeight,
        targetDays: input.targetDays,
        farmId,
        creationDate: new Date(),
        status: LotStatus.ACTIVE,
        currentQuantity: 0,
      });

      const saved = await this.lotRepository.create(lot);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<LotResponseDTO>(LotMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating lot';
      return Result.fail<LotResponseDTO>(message);
    }
  }
}
