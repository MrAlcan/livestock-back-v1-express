import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  RecordFinancialMovement,
  ApproveFinancialMovement,
  MarkAsPayment,
  CancelFinancialMovement,
  GetFinancialMovementDetails,
  ListFinancialMovements,
  GetOverduePayments,
  CalculateProfit,
  CalculateLotProfitability,
} from '../../../application/finance';

export class FinancialMovementController extends BaseController {
  constructor(
    private readonly recordMovementUC: RecordFinancialMovement,
    private readonly approveMovementUC: ApproveFinancialMovement,
    private readonly markAsPaymentUC: MarkAsPayment,
    private readonly cancelMovementUC: CancelFinancialMovement,
    private readonly getMovementDetailsUC: GetFinancialMovementDetails,
    private readonly listMovementsUC: ListFinancialMovements,
    private readonly getOverduePaymentsUC: GetOverduePayments,
    private readonly calculateProfitUC: CalculateProfit,
    private readonly calculateLotProfitabilityUC: CalculateLotProfitability,
  ) {
    super();
  }

  readonly recordMovement = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.recordMovementUC.execute({
        ...req.body,
        registeredBy: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly approveMovement = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.approveMovementUC.execute({
        movementId: req.params.id as string,
        approvedBy: req.user!.userId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly markAsPayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.markAsPaymentUC.execute({
        movementId: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly cancelMovement = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.cancelMovementUC.execute({ movementId: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getMovementDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getMovementDetailsUC.execute({ id: req.params.id as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listMovements = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.listMovementsUC.execute({
        filters: req.query as Record<string, string>,
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getOverduePayments = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getOverduePaymentsUC.execute();
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly calculateProfit = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.calculateProfitUC.execute({
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        farmId: req.user!.farmId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly calculateLotProfitability = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.calculateLotProfitabilityUC.execute({ lotId: req.params.lotId as string });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
