import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Animal } from '../../../domain/animals/entities/Animal';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateAnimalInputDTO, AnimalResponseDTO } from '../dtos/AnimalDTOs';
import { AnimalMapper } from '../mappers/AnimalMapper';

export class UpdateAnimal implements IUseCase<UpdateAnimalInputDTO, AnimalResponseDTO> {
  constructor(
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: UpdateAnimalInputDTO): Promise<Result<AnimalResponseDTO>> {
    try {
      const animal = await this.animalRepository.findById(new UniqueId(input.id));
      if (!animal) {
        return Result.fail<AnimalResponseDTO>('Animal not found');
      }

      // Animal entity uses private fields; we recreate with updated props
      // For mutable fields that the domain allows direct updating,
      // we reconstruct via Animal.create with merged props
      const updatedAnimal = Animal.create(
        {
          officialId: animal.officialId,
          temporaryId: animal.temporaryId,
          brandMark: animal.brandMark,
          visualTag: animal.visualTag,
          electronicId: animal.electronicId,
          sex: animal.sex,
          birthDate: animal.birthDate,
          isEstimatedBirthDate: animal.isEstimatedBirthDate,
          breedId: animal.breedId,
          breedPercentage: animal.breedPercentage,
          coatColor: input.coatColor !== undefined ? input.coatColor : animal.coatColor,
          status: animal.status,
          substatus: animal.substatus,
          exitDate: animal.exitDate,
          exitReason: animal.exitReason,
          birthWeight: animal.birthWeight,
          currentWeight: animal.currentWeight,
          lastWeighingDate: animal.lastWeighingDate,
          motherId: animal.motherId,
          fatherId: animal.fatherId,
          currentLotId: animal.currentLotId,
          currentPaddockId: animal.currentPaddockId,
          farmId: animal.farmId,
          origin: animal.origin,
          observations: input.observations !== undefined ? input.observations : animal.observations,
          photoUrl: input.photoUrl !== undefined ? input.photoUrl : animal.photoUrl,
          syncStatus: animal.syncStatus,
          syncVersion: animal.syncVersion,
          deviceId: animal.deviceId,
        },
        animal.id,
        animal.createdAt,
      );

      const saved = await this.animalRepository.update(updatedAnimal);
      return Result.ok<AnimalResponseDTO>(AnimalMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating animal';
      return Result.fail<AnimalResponseDTO>(message);
    }
  }
}
