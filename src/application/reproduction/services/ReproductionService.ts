import { Result } from '../../../domain/shared/Result';
import { ReproductionKPICalculatorService, BirthProjectionService } from '../../../domain/reproduction/services';
import { IEventBus } from '../../shared/ports/IEventBus';
import { IReproductionCycleRepository } from './IReproductionCycleRepository';
import {
  RegisterReproductiveServiceInputDTO,
  RecordDiagnosisInputDTO,
  RecordBirthInputDTO,
  RecordWeaningInputDTO,
  ReproductiveCycleResponseDTO,
  ReproductivePerformanceResponseDTO,
  FarmReproductiveStatsResponseDTO,
} from '../dtos/ReproductionDTOs';
import { RegisterReproductiveService } from '../use-cases/RegisterReproductiveService';
import { RecordDiagnosis } from '../use-cases/RecordDiagnosis';
import { RecordBirth } from '../use-cases/RecordBirth';
import { RecordWeaning } from '../use-cases/RecordWeaning';
import { GetReproductiveCycle } from '../use-cases/GetReproductiveCycle';
import { ListActiveReproductiveCycles } from '../use-cases/ListActiveReproductiveCycles';
import { CalculateReproductivePerformance } from '../use-cases/CalculateReproductivePerformance';
import { GetFarmReproductiveStats } from '../use-cases/GetFarmReproductiveStats';

export class ReproductionService {
  private readonly registerReproductiveServiceUC: RegisterReproductiveService;
  private readonly recordDiagnosisUC: RecordDiagnosis;
  private readonly recordBirthUC: RecordBirth;
  private readonly recordWeaningUC: RecordWeaning;
  private readonly getReproductiveCycleUC: GetReproductiveCycle;
  private readonly listActiveReproductiveCyclesUC: ListActiveReproductiveCycles;
  private readonly calculateReproductivePerformanceUC: CalculateReproductivePerformance;
  private readonly getFarmReproductiveStatsUC: GetFarmReproductiveStats;

  constructor(
    private readonly reproductionCycleRepository: IReproductionCycleRepository,
    private readonly eventBus: IEventBus,
  ) {
    const kpiCalculator = new ReproductionKPICalculatorService();
    const birthProjectionService = new BirthProjectionService();

    this.registerReproductiveServiceUC = new RegisterReproductiveService(
      this.reproductionCycleRepository,
      birthProjectionService,
      this.eventBus,
    );
    this.recordDiagnosisUC = new RecordDiagnosis(
      this.reproductionCycleRepository,
      this.eventBus,
    );
    this.recordBirthUC = new RecordBirth(
      this.reproductionCycleRepository,
      this.eventBus,
    );
    this.recordWeaningUC = new RecordWeaning(
      this.reproductionCycleRepository,
      this.eventBus,
    );
    this.getReproductiveCycleUC = new GetReproductiveCycle(
      this.reproductionCycleRepository,
    );
    this.listActiveReproductiveCyclesUC = new ListActiveReproductiveCycles(
      this.reproductionCycleRepository,
    );
    this.calculateReproductivePerformanceUC = new CalculateReproductivePerformance(
      this.reproductionCycleRepository,
      kpiCalculator,
    );
    this.getFarmReproductiveStatsUC = new GetFarmReproductiveStats(
      this.reproductionCycleRepository,
      kpiCalculator,
    );
  }

  async registerService(
    input: RegisterReproductiveServiceInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    return this.registerReproductiveServiceUC.execute(input);
  }

  async recordDiagnosis(
    input: RecordDiagnosisInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    return this.recordDiagnosisUC.execute(input);
  }

  async recordBirth(
    input: RecordBirthInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    return this.recordBirthUC.execute(input);
  }

  async recordWeaning(
    input: RecordWeaningInputDTO,
  ): Promise<Result<ReproductiveCycleResponseDTO>> {
    return this.recordWeaningUC.execute(input);
  }

  async getCyclesByFemale(
    femaleId: string,
  ): Promise<Result<ReproductiveCycleResponseDTO[]>> {
    return this.getReproductiveCycleUC.execute({ femaleId });
  }

  async listActiveCycles(
    farmId: string,
  ): Promise<Result<ReproductiveCycleResponseDTO[]>> {
    return this.listActiveReproductiveCyclesUC.execute({ farmId });
  }

  async calculatePerformance(
    femaleId: string,
  ): Promise<Result<ReproductivePerformanceResponseDTO>> {
    return this.calculateReproductivePerformanceUC.execute({ femaleId });
  }

  async getFarmStats(
    farmId: string,
  ): Promise<Result<FarmReproductiveStatsResponseDTO>> {
    return this.getFarmReproductiveStatsUC.execute({ farmId });
  }
}
