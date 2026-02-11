import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { FinancialMovement } from '../../../domain/finance/entities/FinancialMovement';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { FinancialStatus } from '../../../domain/finance/enums';
import { IUseCase } from '../../shared/types/IUseCase';
import { FinancialMovementResponseDTO } from '../dtos/FinanceDTOs';
import { FinancialMovementMapper } from '../mappers/FinancialMovementMapper';

interface CancelFinancialMovementInput {
  readonly movementId: string;
}

export class CancelFinancialMovement implements IUseCase<CancelFinancialMovementInput, FinancialMovementResponseDTO> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
  ) {}

  async execute(input: CancelFinancialMovementInput): Promise<Result<FinancialMovementResponseDTO>> {
    try {
      const movement = await this.movementRepository.findById(new UniqueId(input.movementId));
      if (!movement) {
        return Result.fail<FinancialMovementResponseDTO>('Financial movement not found');
      }

      if (movement.status === FinancialStatus.CANCELLED) {
        return Result.fail<FinancialMovementResponseDTO>('Movement is already cancelled');
      }

      if (movement.status === FinancialStatus.PAID) {
        return Result.fail<FinancialMovementResponseDTO>('Cannot cancel a paid movement');
      }

      // Reconstruct with cancelled status since entity does not expose a cancel method
      const cancelled = FinancialMovement.create(
        {
          voucherNumber: movement.voucherNumber,
          type: movement.type,
          category: movement.category,
          subcategory: movement.subcategory,
          amount: movement.amount,
          currency: movement.currency,
          exchangeRate: movement.exchangeRate,
          baseAmount: movement.baseAmount,
          date: movement.date,
          dueDate: movement.dueDate,
          paymentDate: movement.paymentDate,
          paymentMethod: movement.paymentMethod,
          description: movement.description,
          thirdPartyId: movement.thirdPartyId,
          gmaId: movement.gmaId,
          lotId: movement.lotId,
          productId: movement.productId,
          registeredBy: movement.registeredBy,
          approvedBy: movement.approvedBy,
          status: FinancialStatus.CANCELLED,
          isRecurring: movement.isRecurring,
          frequency: movement.frequency,
          documentUrl: movement.documentUrl,
          observations: movement.observations,
        },
        movement.id,
        movement.createdAt,
      );

      const saved = await this.movementRepository.update(cancelled);
      return Result.ok<FinancialMovementResponseDTO>(FinancialMovementMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error cancelling financial movement';
      return Result.fail<FinancialMovementResponseDTO>(message);
    }
  }
}
