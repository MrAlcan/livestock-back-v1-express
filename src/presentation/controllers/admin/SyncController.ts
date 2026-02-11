import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { parsePagination } from '../../utils/pagination';
import {
  InitiateSync,
  ApplySyncChanges,
  ResolveConflict,
  GetSyncStatus,
  GetSyncHistory,
  ListUnresolvedConflicts,
} from '../../../application/sync';

export class SyncController extends BaseController {
  constructor(
    private readonly initiateSyncUC: InitiateSync,
    private readonly applySyncChangesUC: ApplySyncChanges,
    private readonly resolveConflictUC: ResolveConflict,
    private readonly getSyncStatusUC: GetSyncStatus,
    private readonly getSyncHistoryUC: GetSyncHistory,
    private readonly listUnresolvedConflictsUC: ListUnresolvedConflicts,
  ) {
    super();
  }

  readonly initiateSync = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.initiateSyncUC.execute({
        ...req.body,
        userId: req.user!.userId,
      });
      return this.handleResult(res, result, 201);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly applySyncChanges = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.applySyncChangesUC.execute(req.body);
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly resolveConflict = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.resolveConflictUC.execute({
        conflictId: req.params.id as string,
        resolutionStrategy: req.body.resolutionStrategy,
        resolvedBy: req.user!.userId,
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getSyncStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getSyncStatusUC.execute({ deviceId: (req.query.deviceId as string) || req.user!.userId });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly getSyncHistory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await this.getSyncHistoryUC.execute({
        filters: { ...req.query, userId: req.user!.userId },
        pagination: { page, pageSize: limit },
      });
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };

  readonly listUnresolvedConflicts = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.listUnresolvedConflictsUC.execute({});
      return this.handleResult(res, result);
    } catch (error) {
      return this.internalError(res, error);
    }
  };
}
