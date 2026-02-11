import { Result } from '../../../domain/shared/Result';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { FinancialType } from '../../../domain/finance/enums';
import { IUseCase } from '../../shared/types/IUseCase';
import { ProfitCalculationResponseDTO } from '../dtos/FinanceDTOs';

interface CalculateProfitInput {
  readonly startDate: string;
  readonly endDate: string;
  readonly farmId: string;
}

export class CalculateProfit implements IUseCase<CalculateProfitInput, ProfitCalculationResponseDTO> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
  ) {}

  async execute(input: CalculateProfitInput): Promise<Result<ProfitCalculationResponseDTO>> {
    try {
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      if (endDate < startDate) {
        return Result.fail<ProfitCalculationResponseDTO>('End date must be after start date');
      }

      const [incomeMovements, expenseMovements] = await Promise.all([
        this.movementRepository.findByDateRange(startDate, endDate, FinancialType.INCOME),
        this.movementRepository.findByDateRange(startDate, endDate, FinancialType.EXPENSE),
      ]);

      const totalIncome = incomeMovements.reduce((sum, m) => sum + m.amount, 0);
      const totalExpense = expenseMovements.reduce((sum, m) => sum + m.amount, 0);
      const profit = Math.round((totalIncome - totalExpense) * 100) / 100;
      const profitMargin = totalIncome > 0
        ? Math.round(((totalIncome - totalExpense) / totalIncome) * 10000) / 100
        : 0;

      return Result.ok<ProfitCalculationResponseDTO>({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        profit,
        profitMargin,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error calculating profit';
      return Result.fail<ProfitCalculationResponseDTO>(message);
    }
  }
}
