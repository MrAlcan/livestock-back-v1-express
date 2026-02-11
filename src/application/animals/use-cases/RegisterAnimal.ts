import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Animal } from '../../../domain/animals/entities/Animal';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { AnimalStatus, AnimalOrigin, SyncStatus } from '../../../domain/animals/enums';
import { OfficialId } from '../../../domain/animals/value-objects/OfficialId';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IUseCase } from '../../shared/types/IUseCase';
import { IEventBus } from '../../shared/ports/IEventBus';
import { RegisterAnimalInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class RegisterAnimal implements IUseCase<RegisterAnimalInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: RegisterAnimalInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      // Validate official ID uniqueness if provided
      if (input.officialId) {
        const officialId = OfficialId.create(input.officialId);
        const existing = await this.animalRepository.findByOfficialId(officialId);
        if (existing) {
          return Result.fail<AnimalResponseDTO>('An animal with this official ID already exists');
        }
      }

      // Validate electronic ID uniqueness if provided
      if (input.electronicId) {
        const existing = await this.animalRepository.findByElectronicId(input.electronicId);
        if (existing) {
          return Result.fail<AnimalResponseDTO>('An animal with this electronic ID already exists');
        }
      }

      const animal = Animal.create({
        officialId: input.officialId ? OfficialId.create(input.officialId) : undefined,
        temporaryId: input.temporaryId,
        brandMark: input.brandMark,
        visualTag: input.visualTag,
        electronicId: input.electronicId,
        sex: input.sex,
        birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
        isEstimatedBirthDate: input.isEstimatedBirthDate ?? false,
        breedId: input.breedId ? new UniqueId(input.breedId) : undefined,
        breedPercentage: input.breedPercentage,
        coatColor: input.coatColor,
        status: AnimalStatus.ACTIVE,
        origin: input.origin,
        birthWeight: input.birthWeight ? Weight.create(input.birthWeight) : undefined,
        motherId: input.motherId ? new UniqueId(input.motherId) : undefined,
        fatherId: input.fatherId ? new UniqueId(input.fatherId) : undefined,
        currentLotId: input.currentLotId ? new UniqueId(input.currentLotId) : undefined,
        currentPaddockId: input.currentPaddockId ? new UniqueId(input.currentPaddockId) : undefined,
        farmId: new UniqueId(input.farmId),
        observations: input.observations,
        photoUrl: input.photoUrl,
        syncStatus: SyncStatus.PENDING,
        syncVersion: 1,
      });

      const saved = await this.animalRepository.create(animal);

      // Publish domain events
      if (saved.domainEvents.length > 0) {
        await this.eventBus.publishAll(saved.domainEvents);
        saved.clearDomainEvents();
      }

      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error registering animal';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
