import { Result } from '../../../domain/shared/Result';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

export class ListPendingSyncEvents implements IUseCase<void, EventResponseDTO[]> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(): Promise<Result<EventResponseDTO[]>> {
    try {
      const events = await this.eventRepository.findPendingSync();

      const eventDTOs = events.map((event) => EventMapper.toDTO(event));

      return Result.ok<EventResponseDTO[]>(eventDTOs);
    } catch (error) {
      return Result.fail<EventResponseDTO[]>(
        error instanceof Error ? error.message : 'Failed to list pending sync events',
      );
    }
  }
}
