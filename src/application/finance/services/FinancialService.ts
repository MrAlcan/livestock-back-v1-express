import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IFinancialMovementRepository, IThirdPartyRepository } from '../../../domain/finance/repositories';
import { FinancialType } from '../../../domain/finance/enums';
import { LotFinancialAnalyzerService } from '../../../domain/finance/services';
import { ProfitCalculationResponseDTO, LotProfitabilityResponseDTO } from '../dtos/FinanceDTOs';

export class FinancialService {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
    private readonly thirdPartyRepository: IThirdPartyRepository,
    private readonly analyzerService: LotFinancialAnalyzerService,
  ) {}

  async calculateProfitByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Result<ProfitCalculationResponseDTO>> {
    try {
      const [incomeMovements, expenseMovements] = await Promise.all([
        this.movementRepository.findByDateRange(startDate, endDate, FinancialType.INCOME),
        this.movementRepository.findByDateRange(startDate, endDate, FinancialType.EXPENSE),
      ]);

      const totalIncome = incomeMovements.reduce((sum, m) => sum + m.amount, 0);
      const totalExpense = expenseMovements.reduce((sum, m) => sum + m.amount, 0);
      const profit = this.analyzerService.calculateGrossMargin(totalIncome, totalExpense);
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

  async calculateLotProfitability(lotId: string): Promise<Result<LotProfitabilityResponseDTO>> {
    try {
      const movements = await this.movementRepository.findByLot(new UniqueId(lotId));

      const totalCost = movements
        .filter((m) => m.type === FinancialType.EXPENSE)
        .reduce((sum, m) => sum + m.amount, 0);

      const totalIncome = movements
        .filter((m) => m.type === FinancialType.INCOME)
        .reduce((sum, m) => sum + m.amount, 0);

      const profit = this.analyzerService.calculateGrossMargin(totalIncome, totalCost);

      let roiPercentage = 0;
      try {
        const roi = this.analyzerService.calculateROI(totalCost, totalIncome);
        roiPercentage = roi.percentage;
      } catch {
        // ROI cannot be calculated when totalCost is zero
      }

      return Result.ok<LotProfitabilityResponseDTO>({
        lotId,
        totalCost: Math.round(totalCost * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        profit,
        roi: roiPercentage,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error calculating lot profitability';
      return Result.fail<LotProfitabilityResponseDTO>(message);
    }
  }

  async updateThirdPartyBalance(thirdPartyId: string, amount: number): Promise<Result<void>> {
    try {
      const id = new UniqueId(thirdPartyId);
      const thirdParty = await this.thirdPartyRepository.findById(id);
      if (!thirdParty) {
        return Result.fail<void>('Third party not found');
      }

      thirdParty.updateBalance(amount);
      await this.thirdPartyRepository.updateBalance(id, thirdParty.currentBalance);

      return Result.ok<void>();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating third party balance';
      return Result.fail<void>(message);
    }
  }
}
