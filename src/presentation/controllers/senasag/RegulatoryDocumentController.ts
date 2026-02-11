import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import {
  CreateRegulatoryDocument,
  UpdateDocumentStatus,
  ListRegulatoryDocuments,
  GetExpiringDocuments,
} from '../../../application/senasag';

export class RegulatoryDocumentController extends BaseController {
  constructor(
    private readonly createDocumentUC: CreateRegulatoryDocument,
    private readonly updateStatusUC: UpdateDocumentStatus,
    private readonly listDocumentsUC: ListRegulatoryDocuments,
    private readonly getExpiringDocumentsUC: GetExpiringDocuments,
  ) {
    super();
  }

  readonly createDocument = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.createDocumentUC.execute({
        ...req.body,
        farmId: req.user!.farmId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.updateStatusUC.execute({
        id: req.params.id as string,
        ...req.body,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listDocuments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listDocumentsUC.execute({ farmId: req.user!.farmId });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getExpiringDocuments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const threshold = parseInt(req.query.days as string || '30', 10);
      const result = await this.getExpiringDocumentsUC.execute({
        daysThreshold: threshold,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
