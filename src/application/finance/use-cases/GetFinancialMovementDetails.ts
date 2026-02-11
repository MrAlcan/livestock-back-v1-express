import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { FinancialMovementResponseDTO } from '../dtos/FinanceDTOs';
import { FinancialMovementMapper } from '../mappers/FinancialMovementMapper';

interface GetFinancialMovementDetailsInput {
  readonly id: string;
}

export class GetFinancialMovementDetails implements IUseCase<GetFinancialMovementDetailsInput, FinancialMovementResponseDTO> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
  ) {}

  async execute(input: GetFinancialMovementDetailsInput): Promise<Result<FinancialMovementResponseDTO>> {
    try {
      const movement = await this.movementRepository.findById(new UniqueId(input.id));
      if (!movement) {
        return Result.fail<FinancialMovementResponseDTO>('Financial movement not found');
      }

      return Result.ok<FinancialMovementResponseDTO>(FinancialMovementMapper.toDTO(movement));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting financial movement details';
      return Result.fail<FinancialMovementResponseDTO>(message);
    }
  }
}
