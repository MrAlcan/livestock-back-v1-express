import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  RegisterReproductiveService,
  RecordDiagnosis,
  RecordBirth,
  RecordWeaning,
  GetReproductiveCycle,
  ListActiveReproductiveCycles,
  CalculateReproductivePerformance,
  GetFarmReproductiveStats,
} from '../../../application/reproduction';

export class ReproductionController extends BaseController {
  constructor(
    private readonly registerServiceUC: RegisterReproductiveService,
    private readonly recordDiagnosisUC: RecordDiagnosis,
    private readonly recordBirthUC: RecordBirth,
    private readonly recordWeaningUC: RecordWeaning,
    private readonly getReproductiveCycleUC: GetReproductiveCycle,
    private readonly listActiveCyclesUC: ListActiveReproductiveCycles,
    private readonly calculatePerformanceUC: CalculateReproductivePerformance,
    private readonly getFarmStatsUC: GetFarmReproductiveStats,
  ) {
    super();
  }

  readonly registerService = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.registerServiceUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly recordDiagnosis = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.recordDiagnosisUC.execute(req.body);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly recordBirth = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.recordBirthUC.execute(req.body);
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly recordWeaning = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.recordWeaningUC.execute(req.body);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getCycle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getReproductiveCycleUC.execute({ femaleId: req.params.femaleId as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listActiveCycles = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listActiveCyclesUC.execute({
        farmId: req.user!.farmId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly calculatePerformance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.calculatePerformanceUC.execute({ femaleId: req.params.femaleId as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getFarmStats = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getFarmStatsUC.execute({ farmId: req.user!.farmId });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
