import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { WithdrawalPeriodCheckerService } from '../../../domain/health/services';
import { IUseCase } from '../../shared/types/IUseCase';

interface CheckWithdrawalPeriodInput {
  readonly animalId: string;
  readonly checkDate: string;
}

interface WithdrawalPeriodResultDTO {
  readonly animalId: string;
  readonly isInWithdrawalPeriod: boolean;
  readonly withdrawalEndDate?: string;
}

export class CheckWithdrawalPeriod implements IUseCase<CheckWithdrawalPeriodInput, WithdrawalPeriodResultDTO> {
  constructor(
    private readonly withdrawalPeriodChecker: WithdrawalPeriodCheckerService,
  ) {}

  async execute(input: CheckWithdrawalPeriodInput): Promise<Result<WithdrawalPeriodResultDTO>> {
    try {
      const animalId = new UniqueId(input.animalId);
      const checkDate = new Date(input.checkDate);

      const isInWithdrawal = await this.withdrawalPeriodChecker.isInWithdrawalPeriod(animalId, checkDate);
      const endDate = await this.withdrawalPeriodChecker.getWithdrawalEndDate(animalId);

      const dto: WithdrawalPeriodResultDTO = {
        animalId: input.animalId,
        isInWithdrawalPeriod: isInWithdrawal,
        withdrawalEndDate: endDate?.toISOString(),
      };

      return Result.ok<WithdrawalPeriodResultDTO>(dto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error checking withdrawal period';
      return Result.fail<WithdrawalPeriodResultDTO>(message);
    }
  }
}
