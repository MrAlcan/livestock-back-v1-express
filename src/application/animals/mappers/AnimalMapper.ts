import { Animal } from '../../../domain/animals/entities/Animal';
import { AnimalResponseDTO } from '../dtos/AnimalDTOs';

export class AnimalMapper {
  static toDTO(animal: Animal): AnimalResponseDTO {
    const age = animal.calculateAge();

    return {
      id: animal.id.value,
      officialId: animal.officialId?.value,
      temporaryId: animal.temporaryId,
      brandMark: animal.brandMark,
      visualTag: animal.visualTag,
      electronicId: animal.electronicId,
      sex: animal.sex,
      birthDate: animal.birthDate?.toISOString(),
      isEstimatedBirthDate: animal.isEstimatedBirthDate,
      ageMonths: age ? age.toMonths() : undefined,
      breedId: animal.breedId?.value,
      breedPercentage: animal.breedPercentage,
      coatColor: animal.coatColor,
      status: animal.status,
      substatus: animal.substatus,
      exitDate: animal.exitDate?.toISOString(),
      exitReason: animal.exitReason,
      birthWeight: animal.birthWeight?.kilograms,
      currentWeight: animal.currentWeight?.kilograms,
      lastWeighingDate: animal.lastWeighingDate?.toISOString(),
      motherId: animal.motherId?.value,
      fatherId: animal.fatherId?.value,
      currentLotId: animal.currentLotId?.value,
      currentPaddockId: animal.currentPaddockId?.value,
      farmId: animal.farmId.value,
      origin: animal.origin,
      observations: animal.observations,
      photoUrl: animal.photoUrl,
      syncStatus: animal.syncStatus,
    };
  }
}
