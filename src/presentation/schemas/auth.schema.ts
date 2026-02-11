import { z } from 'zod';

export const registerUserSchema = z.object({
  fullName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().url('URL de avatar inválida').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(8, 'Nueva contraseña debe tener al menos 8 caracteres'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  newPassword: z.string().min(8, 'Nueva contraseña debe tener al menos 8 caracteres'),
});

export const updateUserProfileSchema = z.object({
  fullName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url('URL inválida').optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export const createRoleSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  permissionIds: z.array(z.number().int().positive()),
});

export const updateRoleSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.number().int().positive()).optional(),
});

export const createPermissionSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  module: z.string().min(1, 'Módulo requerido'),
  action: z.string().min(1, 'Acción requerida'),
  description: z.string().optional(),
});

export const updatePermissionSchema = z.object({
  code: z.string().optional(),
  module: z.string().optional(),
  action: z.string().optional(),
  description: z.string().optional(),
});

export const userFiltersSchema = z.object({
  status: z.string().optional(),
  farmId: z.string().uuid().optional(),
  roleId: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
});

export const auditLogFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  tableName: z.string().optional(),
  recordId: z.string().optional(),
});

export const assignRoleSchema = z.object({
  roleId: z.number().int().positive(),
});

export const removeRoleSchema = z.object({
  roleId: z.number().int().positive(),
});
