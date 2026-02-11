import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { FinancialStatus } from '../../../domain/finance/enums';
import { IUseCase } from '../../shared/types/IUseCase';
import { ApproveFinancialMovementInputDTO, FinancialMovementResponseDTO } from '../dtos/FinanceDTOs';
import { FinancialMovementMapper } from '../mappers/FinancialMovementMapper';

export class ApproveFinancialMovement implements IUseCase<ApproveFinancialMovementInputDTO, FinancialMovementResponseDTO> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
  ) {}

  async execute(input: ApproveFinancialMovementInputDTO): Promise<Result<FinancialMovementResponseDTO>> {
    try {
      const movement = await this.movementRepository.findById(new UniqueId(input.movementId));
      if (!movement) {
        return Result.fail<FinancialMovementResponseDTO>('Financial movement not found');
      }

      if (movement.status !== FinancialStatus.PENDING) {
        return Result.fail<FinancialMovementResponseDTO>('Only pending movements can be approved');
      }

      movement.approve(new UniqueId(input.approvedBy));

      const saved = await this.movementRepository.update(movement);
      return Result.ok<FinancialMovementResponseDTO>(FinancialMovementMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error approving financial movement';
      return Result.fail<FinancialMovementResponseDTO>(message);
    }
  }
}
