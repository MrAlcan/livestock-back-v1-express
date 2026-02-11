import { Result } from '../../../domain/shared/Result';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { OverduePaymentResponseDTO } from '../dtos/FinanceDTOs';

export class GetOverduePayments implements IUseCase<void, OverduePaymentResponseDTO[]> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
  ) {}

  async execute(): Promise<Result<OverduePaymentResponseDTO[]>> {
    try {
      const overdueMovements = await this.movementRepository.findOverdue();
      const now = new Date();

      const items: OverduePaymentResponseDTO[] = overdueMovements.map((movement) => {
        const dueDate = movement.dueDate!;
        const diffMs = now.getTime() - dueDate.getTime();
        const daysOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        return {
          id: movement.id.value,
          voucherNumber: movement.voucherNumber,
          amount: movement.amount,
          currency: movement.currency,
          dueDate: dueDate.toISOString(),
          daysOverdue,
          thirdPartyId: movement.thirdPartyId?.value,
        };
      });

      return Result.ok<OverduePaymentResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting overdue payments';
      return Result.fail<OverduePaymentResponseDTO[]>(message);
    }
  }
}
