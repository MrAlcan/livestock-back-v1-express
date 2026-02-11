import { Result } from '../../../domain/shared/Result';
import { Breed } from '../../../domain/animals/entities/Breed';
import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateBreedInputDTO, BreedResponseDTO } from '../dtos/AnimalDTOs';
import { BreedMapper } from '../mappers/BreedMapper';

export class UpdateBreed implements IUseCase<UpdateBreedInputDTO, BreedResponseDTO> {
  constructor(
    private readonly breedRepository: IBreedRepository,
  ) {}

  async execute(input: UpdateBreedInputDTO): Promise<Result<BreedResponseDTO>> {
    try {
      const existing = await this.breedRepository.findById(input.id);
      if (!existing) {
        return Result.fail<BreedResponseDTO>('Breed not found');
      }

      // Check code uniqueness if being changed
      if (input.code && input.code !== existing.code) {
        const byCode = await this.breedRepository.findByCode(input.code);
        if (byCode) {
          return Result.fail<BreedResponseDTO>('A breed with this code already exists');
        }
      }

      const updatedBreed = Breed.create({
        id: existing.id,
        code: input.code ?? existing.code,
        name: input.name ?? existing.name,
        description: input.description !== undefined ? input.description : existing.description,
        origin: existing.origin,
        averageAdultWeight: existing.averageAdultWeight,
        aptitude: existing.aptitude,
        active: existing.active,
        createdAt: existing.createdAt,
      });

      const saved = await this.breedRepository.update(updatedBreed);
      return Result.ok<BreedResponseDTO>(BreedMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating breed';
      return Result.fail<BreedResponseDTO>(message);
    }
  }
}
