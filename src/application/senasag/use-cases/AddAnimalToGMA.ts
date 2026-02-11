import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IGMARepository } from '../../../domain/senasag/repositories/IGMARepository';
import { GMAStatus } from '../../../domain/senasag/enums';
import { Weight } from '../../../domain/animals/value-objects/Weight';
import { IUseCase } from '../../shared/types/IUseCase';
import { AddAnimalToGMAInputDTO } from '../dtos/SenasagDTOs';

export class AddAnimalToGMA implements IUseCase<AddAnimalToGMAInputDTO, void> {
  constructor(
    private readonly gmaRepository: IGMARepository,
  ) {}

  async execute(input: AddAnimalToGMAInputDTO): Promise<Result<void>> {
    try {
      const gma = await this.gmaRepository.findById(new UniqueId(input.gmaId));
      if (!gma) {
        return Result.fail<void>('GMA not found');
      }

      // Only allow adding animals to pending or approved GMAs
      if (gma.status !== GMAStatus.PENDING_APPROVAL && gma.status !== GMAStatus.APPROVED) {
        return Result.fail<void>('Animals can only be added to pending or approved GMAs');
      }

      const weight = input.departureWeight ? Weight.create(input.departureWeight) : undefined;

      await this.gmaRepository.addAnimal(
        new UniqueId(input.gmaId),
        new UniqueId(input.animalId),
        weight,
      );

      return Result.ok<void>();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error adding animal to GMA';
      return Result.fail<void>(message);
    }
  }
}
