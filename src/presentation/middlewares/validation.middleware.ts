import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/http-response';

export type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[target];
    const result = schema.safeParse(data);

    if (!result.success) {
      const details = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      sendError(res, 400, 'VALIDATION_ERROR', 'Error de validación', details);
      return;
    }

    if (target === 'body') {
      req.body = result.data;
    }

    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return validate(schema, 'query');
}

export function validateParams(schema: ZodSchema) {
  return validate(schema, 'params');
}
