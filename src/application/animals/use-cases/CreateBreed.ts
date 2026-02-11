import { Result } from '../../../domain/shared/Result';
import { Breed } from '../../../domain/animals/entities/Breed';
import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreateBreedInputDTO, BreedResponseDTO } from '../dtos/AnimalDTOs';
import { BreedMapper } from '../mappers/BreedMapper';

export class CreateBreed implements IUseCase<CreateBreedInputDTO, BreedResponseDTO> {
  constructor(
    private readonly breedRepository: IBreedRepository,
  ) {}

  async execute(input: CreateBreedInputDTO): Promise<Result<BreedResponseDTO>> {
    try {
      // Check uniqueness of breed code
      const existing = await this.breedRepository.findByCode(input.code);
      if (existing) {
        return Result.fail<BreedResponseDTO>('A breed with this code already exists');
      }

      const breed = Breed.create({
        id: 0, // Will be assigned by the repository/database
        code: input.code,
        name: input.name,
        description: input.description,
        origin: input.origin,
        averageAdultWeight: input.averageAdultWeight,
        aptitude: input.aptitude,
        active: true,
        createdAt: new Date(),
      });

      const saved = await this.breedRepository.create(breed);
      return Result.ok<BreedResponseDTO>(BreedMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating breed';
      return Result.fail<BreedResponseDTO>(message);
    }
  }
}
