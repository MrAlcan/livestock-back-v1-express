import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import { GetAuditLogs } from '../../../application/auth';

export class AuditController extends BaseController {
  constructor(
    private readonly getAuditLogsUC: GetAuditLogs,
  ) {
    super();
  }

  readonly getAuditLogs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.getAuditLogsUC.execute({
        filters: req.query as Record<string, string>,
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
