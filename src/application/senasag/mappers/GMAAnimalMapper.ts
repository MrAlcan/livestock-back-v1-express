import { GMAAnimal } from '../../../domain/senasag/entities/GMAAnimal';
import { GMAAnimalResponseDTO } from '../dtos/SenasagDTOs';

export class GMAAnimalMapper {
  static toDTO(gmaAnimal: GMAAnimal): GMAAnimalResponseDTO {
    return {
      gmaId: gmaAnimal.gmaId.value,
      animalId: gmaAnimal.animalId.value,
      departureWeight: gmaAnimal.departureWeight?.kilograms,
      arrivalWeight: gmaAnimal.arrivalWeight?.kilograms,
      departureStatus: gmaAnimal.departureStatus,
      arrivalStatus: gmaAnimal.arrivalStatus,
    };
  }
}
