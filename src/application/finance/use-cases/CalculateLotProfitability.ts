import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { IFinancialMovementRepository } from '../../../domain/finance/repositories';
import { FinancialType } from '../../../domain/finance/enums';
import { LotFinancialAnalyzerService } from '../../../domain/finance/services';
import { ROI } from '../../../domain/finance/value-objects/ROI';
import { IUseCase } from '../../shared/types/IUseCase';
import { LotProfitabilityResponseDTO } from '../dtos/FinanceDTOs';

interface CalculateLotProfitabilityInput {
  readonly lotId: string;
}

export class CalculateLotProfitability implements IUseCase<CalculateLotProfitabilityInput, LotProfitabilityResponseDTO> {
  constructor(
    private readonly movementRepository: IFinancialMovementRepository,
    private readonly analyzerService: LotFinancialAnalyzerService,
  ) {}

  async execute(input: CalculateLotProfitabilityInput): Promise<Result<LotProfitabilityResponseDTO>> {
    try {
      const lotId = new UniqueId(input.lotId);
      const movements = await this.movementRepository.findByLot(lotId);

      const totalCost = movements
        .filter((m) => m.type === FinancialType.EXPENSE)
        .reduce((sum, m) => sum + m.amount, 0);

      const totalIncome = movements
        .filter((m) => m.type === FinancialType.INCOME)
        .reduce((sum, m) => sum + m.amount, 0);

      const profit = this.analyzerService.calculateGrossMargin(totalIncome, totalCost);

      let roi: ROI;
      try {
        roi = this.analyzerService.calculateROI(totalCost, totalIncome);
      } catch {
        // If totalCost is zero, ROI cannot be calculated
        roi = ROI.create(0);
      }

      return Result.ok<LotProfitabilityResponseDTO>({
        lotId: input.lotId,
        totalCost: Math.round(totalCost * 100) / 100,
        totalIncome: Math.round(totalIncome * 100) / 100,
        profit,
        roi: roi.percentage,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error calculating lot profitability';
      return Result.fail<LotProfitabilityResponseDTO>(message);
    }
  }
}
