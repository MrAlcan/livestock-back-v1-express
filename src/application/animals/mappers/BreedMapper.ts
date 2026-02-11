import { Breed } from '../../../domain/animals/entities/Breed';
import { BreedResponseDTO } from '../dtos/AnimalDTOs';

export class BreedMapper {
  static toDTO(breed: Breed): BreedResponseDTO {
    return {
      id: breed.id,
      code: breed.code,
      name: breed.name,
      description: breed.description,
      origin: breed.origin,
      averageAdultWeight: breed.averageAdultWeight,
      aptitude: breed.aptitude,
      active: breed.active,
    };
  }
}
