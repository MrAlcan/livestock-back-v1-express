export interface JwtPayload {
  readonly userId: string;
  readonly email: string;
  readonly roleId: number;
  readonly farmId: string;
}

export interface IJwtService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
  getAccessTokenExpiration(): number;
}
