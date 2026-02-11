import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { Genealogy } from '../../../domain/animals/entities/Genealogy';
import { IGenealogyRepository } from '../../../domain/animals/repositories/IGenealogyRepository';
import { IAnimalRepository } from '../../../domain/animals/repositories/IAnimalRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RecordGenealogyInputDTO, GenealogyResponseDTO } from '../dtos/AnimalDTOs';
import { GenealogyMapper } from '../mappers/GenealogyMapper';

export class RecordGenealogy implements IUseCase<RecordGenealogyInputDTO, GenealogyResponseDTO> {
  constructor(
    private readonly genealogyRepository: IGenealogyRepository,
    private readonly animalRepository: IAnimalRepository,
  ) {}

  async execute(input: RecordGenealogyInputDTO): Promise<Result<GenealogyResponseDTO>> {
    try {
      const animalId = new UniqueId(input.animalId);
      const ancestorId = new UniqueId(input.ancestorId);

      // Validate that both animals exist
      const [animal, ancestor] = await Promise.all([
        this.animalRepository.findById(animalId),
        this.animalRepository.findById(ancestorId),
      ]);

      if (!animal) {
        return Result.fail<GenealogyResponseDTO>('Animal not found');
      }
      if (!ancestor) {
        return Result.fail<GenealogyResponseDTO>('Ancestor animal not found');
      }

      const genealogy = Genealogy.create({
        animalId,
        ancestorId,
        relationType: input.relationType,
        generation: input.generation,
      });

      const saved = await this.genealogyRepository.create(genealogy);
      return Result.ok<GenealogyResponseDTO>(GenealogyMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error recording genealogy';
      return Result.fail<GenealogyResponseDTO>(message);
    }
  }
}
