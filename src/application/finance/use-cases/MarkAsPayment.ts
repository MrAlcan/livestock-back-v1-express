import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { FinancialStatus } from '../../../domain/finance/enums';
import { IUseCase } from '../../shared/types/IUseCase';
import { MarkAsPaymentInputDTO, FinancialMovementResponseDTO } from '../dtos/FinanceDTOs';
import { FinancialMovementMapper } from '../mappers/FinancialMovementMapper';

export class MarkAsPayment implements IUseCase<MarkAsPaymentInputDTO, FinancialMovementResponseDTO> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
  ) {}

  async execute(input: MarkAsPaymentInputDTO): Promise<Result<FinancialMovementResponseDTO>> {
    try {
      const movement = await this.movementRepository.findById(new UniqueId(input.movementId));
      if (!movement) {
        return Result.fail<FinancialMovementResponseDTO>('Financial movement not found');
      }

      if (movement.status === FinancialStatus.PAID) {
        return Result.fail<FinancialMovementResponseDTO>('Movement is already paid');
      }

      if (movement.status === FinancialStatus.CANCELLED) {
        return Result.fail<FinancialMovementResponseDTO>('Cannot mark a cancelled movement as paid');
      }

      movement.markAsPaid(new Date(input.paymentDate));

      const saved = await this.movementRepository.update(movement);
      return Result.ok<FinancialMovementResponseDTO>(FinancialMovementMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error marking movement as paid';
      return Result.fail<FinancialMovementResponseDTO>(message);
    }
  }
}
