import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/http-response';

export function rbac(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Debe estar autenticado');
      return;
    }

    const userRoleId = req.user.roleId;

    const roleMap: Record<number, string> = {
      1: 'PROPIETARIO',
      2: 'CAPATAZ',
      3: 'TECNICO',
      4: 'ADMINISTRATIVO',
    };

    const userRole = roleMap[userRoleId];

    if (!userRole || !allowedRoles.includes(userRole)) {
      sendError(res, 403, 'INSUFFICIENT_PERMISSIONS', 'No tiene permisos para esta acción');
      return;
    }

    next();
  };
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Debe estar autenticado');
      return;
    }

    // Permission check can be expanded with cache-based permission lookup
    next();
  };
}
