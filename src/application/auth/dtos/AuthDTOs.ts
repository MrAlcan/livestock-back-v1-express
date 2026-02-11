// ─── Authentication DTOs ────────────────────────────────────────────────────

export interface RegisterUserInputDTO {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly phoneNumber?: string;
  readonly avatarUrl?: string;
}

export interface LoginInputDTO {
  readonly email: string;
  readonly password: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

export interface LoginResponseDTO {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly user: UserResponseDTO;
}

export interface RefreshTokenInputDTO {
  readonly refreshToken: string;
}

export interface ChangePasswordInputDTO {
  readonly userId: string;
  readonly currentPassword: string;
  readonly newPassword: string;
}

export interface ResetPasswordRequestInputDTO {
  readonly email: string;
}

export interface ResetPasswordConfirmInputDTO {
  readonly token: string;
  readonly newPassword: string;
}

// ─── User DTOs ──────────────────────────────────────────────────────────────

export interface UpdateUserProfileInputDTO {
  readonly userId: string;
  readonly fullName?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly preferences?: Record<string, unknown>;
}

export interface UserResponseDTO {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly status: string;
  readonly roleId: number;
  readonly farmId: string;
  readonly lastAccess?: string;
  readonly preferences?: Record<string, unknown>;
}

export interface UserFiltersDTO {
  readonly status?: string;
  readonly farmId?: string;
  readonly roleId?: number;
  readonly search?: string;
}

// ─── Role DTOs ──────────────────────────────────────────────────────────────

export interface CreateRoleInputDTO {
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly permissionIds: number[];
}

export interface UpdateRoleInputDTO {
  readonly id: number;
  readonly code?: string;
  readonly name?: string;
  readonly description?: string;
  readonly permissionIds?: number[];
}

export interface RoleResponseDTO {
  readonly id: number;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly accessLevel: number;
  readonly isSystem: boolean;
  readonly permissions: PermissionResponseDTO[];
}

// ─── Permission DTOs ────────────────────────────────────────────────────────

export interface CreatePermissionInputDTO {
  readonly code: string;
  readonly module: string;
  readonly action: string;
  readonly description?: string;
}

export interface UpdatePermissionInputDTO {
  readonly id: number;
  readonly code?: string;
  readonly module?: string;
  readonly action?: string;
  readonly description?: string;
}

export interface PermissionResponseDTO {
  readonly id: number;
  readonly code: string;
  readonly module: string;
  readonly action: string;
  readonly description?: string;
}

// ─── Audit Log DTOs ─────────────────────────────────────────────────────────

export interface AuditLogResponseDTO {
  readonly id: string;
  readonly userId: string;
  readonly action: string;
  readonly tableName: string;
  readonly recordId: string;
  readonly oldValues?: Record<string, unknown>;
  readonly newValues?: Record<string, unknown>;
  readonly ipAddress?: string;
  readonly createdAt: string;
}

export interface AuditLogFiltersDTO {
  readonly userId?: string;
  readonly tableName?: string;
  readonly recordId?: string;
}
