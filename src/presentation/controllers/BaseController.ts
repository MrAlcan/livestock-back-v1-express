import { Response } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated, sendError } from '../utils/http-response';
import { mapDomainError } from '../utils/error-mapper';

export abstract class BaseController {
  protected ok<T>(res: Response, data: T): Response {
    return sendSuccess(res, data);
  }

  protected created<T>(res: Response, data: T): Response {
    return sendCreated(res, data);
  }

  protected noContent(res: Response): Response {
    return sendNoContent(res);
  }

  protected paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): Response {
    return sendPaginated(res, data, total, page, limit);
  }

  protected badRequest(res: Response, message: string): Response {
    return sendError(res, 400, 'BAD_REQUEST', message);
  }

  protected unauthorized(res: Response, message: string = 'No autorizado'): Response {
    return sendError(res, 401, 'UNAUTHORIZED', message);
  }

  protected forbidden(res: Response, message: string = 'Acceso denegado'): Response {
    return sendError(res, 403, 'FORBIDDEN', message);
  }

  protected notFound(res: Response, message: string = 'Recurso no encontrado'): Response {
    return sendError(res, 404, 'NOT_FOUND', message);
  }

  protected conflict(res: Response, message: string): Response {
    return sendError(res, 409, 'CONFLICT', message);
  }

  protected unprocessable(res: Response, message: string): Response {
    return sendError(res, 422, 'UNPROCESSABLE_ENTITY', message);
  }

  protected internalError(res: Response, error?: unknown): Response {
    const message = process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : error instanceof Error ? error.message : 'Error interno del servidor';
    return sendError(res, 500, 'INTERNAL_ERROR', message);
  }

  protected handleResult<T>(res: Response, result: { isSuccess: boolean; value?: T; error?: string }, statusCode: number = 200): Response {
    if (result.isSuccess) {
      return res.status(statusCode).json({ success: true, data: result.value });
    }

    const mapped = mapDomainError(result.error || 'Unknown error');
    return sendError(res, mapped.statusCode, mapped.code, mapped.message);
  }

  protected validateBody<T>(schema: ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  }

  protected sendValidationError(res: Response, error: ZodError): Response {
    const details = error.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 400, 'VALIDATION_ERROR', 'Error de validación', details);
  }
}
