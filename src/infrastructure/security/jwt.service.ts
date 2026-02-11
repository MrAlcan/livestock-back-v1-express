import jwt from 'jsonwebtoken';
import { IJwtService, JwtPayload } from '../../application/shared/ports/IJwtService';
import { Logger } from '../logging/logger.service';

export class JwtServiceImpl implements IJwtService {
  private readonly logger: Logger;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.logger = new Logger('JwtService');
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  generateAccessToken(payload: JwtPayload): string {
    try {
      return jwt.sign({ ...payload }, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpiry as string & jwt.SignOptions['expiresIn'],
      });
    } catch (error) {
      this.logger.error('Error generating access token', error);
      throw new Error('Failed to generate access token');
    }
  }

  generateRefreshToken(payload: JwtPayload): string {
    try {
      return jwt.sign({ ...payload }, this.refreshTokenSecret, {
        expiresIn: this.refreshTokenExpiry as string & jwt.SignOptions['expiresIn'],
      });
    } catch (error) {
      this.logger.error('Error generating refresh token', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as jwt.JwtPayload;
      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        roleId: decoded.roleId as number,
        farmId: decoded.farmId as string,
      };
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as jwt.JwtPayload;
      return {
        userId: decoded.userId as string,
        email: decoded.email as string,
        roleId: decoded.roleId as number,
        farmId: decoded.farmId as string,
      };
    } catch {
      return null;
    }
  }

  getAccessTokenExpiration(): number {
    const match = this.accessTokenExpiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }
}
