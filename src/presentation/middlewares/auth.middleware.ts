import { Request, Response, NextFunction } from 'express';
import { IJwtService, JwtPayload } from '../../application/shared/ports/IJwtService';
import { sendError } from '../utils/http-response';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function createAuthMiddleware(jwtService: IJwtService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'MISSING_TOKEN', 'Token de autenticación no proporcionado');
      return;
    }

    const token = authHeader.substring(7);
    const payload = jwtService.verifyAccessToken(token);

    if (!payload) {
      sendError(res, 401, 'INVALID_TOKEN', 'Token inválido o expirado');
      return;
    }

    req.user = payload;
    next();
  };
}
