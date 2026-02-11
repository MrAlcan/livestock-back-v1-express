import { Genealogy } from '../../../domain/animals/entities/Genealogy';
import { GenealogyResponseDTO } from '../dtos/AnimalDTOs';

export class GenealogyMapper {
  static toDTO(genealogy: Genealogy): GenealogyResponseDTO {
    return {
      id: genealogy.id.value,
      animalId: genealogy.animalId.value,
      ancestorId: genealogy.ancestorId.value,
      relationType: genealogy.relationType,
      generation: genealogy.generation,
      inbreedingCoefficient: genealogy.inbreedingCoefficient,
    };
  }
}
