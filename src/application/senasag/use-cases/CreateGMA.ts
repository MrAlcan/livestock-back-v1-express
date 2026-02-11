import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { GMA } from '../../../domain/senasag/entities/GMA';
import { GMAStatus } from '../../../domain/senasag/enums';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories/IRegulatoryDocumentRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { CreateGMAInputDTO, GMAResponseDTO } from '../dtos/SenasagDTOs';
import { GMAMapper } from '../mappers/GMAMapper';

export class CreateGMA implements IUseCase<CreateGMAInputDTO, GMAResponseDTO> {
  constructor(
    private readonly gmaRepository: IGMARepository,
    private readonly regulatoryDocumentRepository: IRegulatoryDocumentRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: CreateGMAInputDTO): Promise<Result<GMAResponseDTO>> {
    try {
      // Validate internal number uniqueness
      const existingGMA = await this.gmaRepository.findByInternalNumber(input.internalNumber);
      if (existingGMA) {
        return Result.fail<GMAResponseDTO>('A GMA with this internal number already exists');
      }

      // Validate RUNSA for the origin farm
      const runsa = await this.regulatoryDocumentRepository.findRUNSA(new UniqueId(input.originFarmId));
      if (!runsa) {
        return Result.fail<GMAResponseDTO>('Origin farm does not have a valid RUNSA document');
      }
      if (runsa.isExpired()) {
        return Result.fail<GMAResponseDTO>('Origin farm RUNSA document has expired');
      }

      // Validate animal quantity
      if (input.animalQuantity <= 0) {
        return Result.fail<GMAResponseDTO>('Animal quantity must be greater than zero');
      }

      const gma = GMA.create({
        internalNumber: input.internalNumber,
        registrarId: new UniqueId(input.registrarId),
        originFarmId: new UniqueId(input.originFarmId),
        transporterId: new UniqueId(input.transporterId),
        destinationId: new UniqueId(input.destinationId),
        type: input.type,
        requestDate: new Date(input.requestDate),
        status: GMAStatus.PENDING_APPROVAL,
        animalQuantity: input.animalQuantity,
        estimatedTotalWeight: input.estimatedTotalWeight,
        distanceKm: input.distanceKm,
        route: input.route,
        observations: input.observations,
      });

      const saved = await this.gmaRepository.create(gma);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<GMAResponseDTO>(GMAMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating GMA';
      return Result.fail<GMAResponseDTO>(message);
    }
  }
}
