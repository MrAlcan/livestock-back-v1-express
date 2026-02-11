import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IEventRepository } from '../../../domain/events/repositories/IEventRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { EventResponseDTO } from '../dtos/EventDTOs';
import { EventMapper } from '../mappers/EventMapper';

interface GetEventDetailsInputDTO {
  readonly eventId: string;
}

export class GetEventDetails implements IUseCase<GetEventDetailsInputDTO, EventResponseDTO> {
  constructor(
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(input: GetEventDetailsInputDTO): Promise<Result<EventResponseDTO>> {
    try {
      const event = await this.eventRepository.findById(new UniqueId(input.eventId));

      if (!event) {
        return Result.fail<EventResponseDTO>('Event not found');
      }

      return Result.ok<EventResponseDTO>(EventMapper.toDTO(event));
    } catch (error) {
      return Result.fail<EventResponseDTO>(
        error instanceof Error ? error.message : 'Failed to get event details',
      );
    }
  }
}
