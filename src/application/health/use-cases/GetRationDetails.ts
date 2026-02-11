import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IRationRepository } from '../../../domain/health/repositories';
import { IRationIngredientRepository } from '../services/IRationIngredientRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RationDetailResponseDTO } from '../dtos/HealthDTOs';
import { RationMapper } from '../mappers/RationMapper';

export class GetRationDetails implements IUseCase<string, RationDetailResponseDTO> {
  constructor(
    private readonly rationRepository: IRationRepository,
    private readonly rationIngredientRepository: IRationIngredientRepository,
  ) {}

  async execute(rationId: string): Promise<Result<RationDetailResponseDTO>> {
    try {
      const ration = await this.rationRepository.findById(new UniqueId(rationId));
      if (!ration) {
        return Result.fail<RationDetailResponseDTO>('Ration not found');
      }

      const ingredients = await this.rationIngredientRepository.findByRation(ration.id);

      return Result.ok<RationDetailResponseDTO>(RationMapper.toDetailDTO(ration, ingredients));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting ration details';
      return Result.fail<RationDetailResponseDTO>(message);
    }
  }
}
