import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ILotRepository, IPaddockRepository } from '../../../domain/lots/repositories';
import { IEventBus } from '../../shared/ports/IEventBus';
import { LotResponseDTO, LotMetricsResponseDTO, PaddockResponseDTO } from '../dtos/LotDTOs';
import { LotMapper } from '../mappers/LotMapper';
import { PaddockMapper } from '../mappers/PaddockMapper';

export class LotService {
  constructor(
    private readonly lotRepository: ILotRepository,
    private readonly paddockRepository: IPaddockRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async getLotWithMetrics(lotId: string): Promise<Result<LotMetricsResponseDTO>> {
    try {
      const lot = await this.lotRepository.findById(new UniqueId(lotId));
      if (!lot) {
        return Result.fail<LotMetricsResponseDTO>('Lot not found');
      }

      const now = new Date();
      const daysActive = Math.floor(
        (now.getTime() - lot.creationDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const metrics: LotMetricsResponseDTO = {
        lotId: lot.id.value,
        animalCount: lot.currentQuantity,
        averageWeight: lot.currentAverageWeight,
        targetWeight: lot.targetWeight,
        daysActive,
        hasReachedTarget: lot.hasReachedTargetWeight(),
      };

      return Result.ok<LotMetricsResponseDTO>(metrics);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting lot metrics';
      return Result.fail<LotMetricsResponseDTO>(message);
    }
  }

  async getAvailablePaddocksForFarm(farmId: string): Promise<Result<PaddockResponseDTO[]>> {
    try {
      const paddocks = await this.paddockRepository.findAvailable(new UniqueId(farmId));
      const items = paddocks.map(PaddockMapper.toDTO);

      return Result.ok<PaddockResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting available paddocks';
      return Result.fail<PaddockResponseDTO[]>(message);
    }
  }

  async closeLotAndNotify(lotId: string): Promise<Result<LotResponseDTO>> {
    try {
      const lot = await this.lotRepository.findById(new UniqueId(lotId));
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

  async updateLotQuantity(lotId: string, newQuantity: number): Promise<Result<void>> {
    try {
      if (newQuantity < 0) {
        return Result.fail<void>('Quantity cannot be negative');
      }

      const lot = await this.lotRepository.findById(new UniqueId(lotId));
      if (!lot) {
        return Result.fail<void>('Lot not found');
      }

      await this.lotRepository.updateQuantity(lot.id, newQuantity);

      return Result.ok<void>();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating lot quantity';
      return Result.fail<void>(message);
    }
  }
}
