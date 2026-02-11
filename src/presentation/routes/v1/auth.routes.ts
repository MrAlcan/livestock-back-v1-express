import { Router } from 'express';
import { validate, validateQuery, validateParams, rbac, loginRateLimiter } from '../../middlewares';
import {
  registerUserSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordConfirmSchema,
  updateUserProfileSchema,
  createRoleSchema,
  updateRoleSchema,
  createPermissionSchema,
  updatePermissionSchema,
  userFiltersSchema,
  auditLogFiltersSchema,
} from '../../schemas/auth.schema';
import { uuidParamSchema } from '../../schemas/common.schema';

export function createAuthRoutes(
  authController: any,
  userController: any,
  roleController: any,
  permissionController: any,
  auditController: any,
  auth: any,
): Router {
  const router = Router();

  // ─── Public routes (no auth) ───────────────────────────────────────

  router.post('/register', validate(registerUserSchema), authController.register);
  router.post('/login', loginRateLimiter, validate(loginSchema), authController.login);
  router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
  router.post('/reset-password/request', validate(resetPasswordRequestSchema), authController.resetPasswordRequest);
  router.post('/reset-password/confirm', validate(resetPasswordConfirmSchema), authController.resetPasswordConfirm);

  // ─── Authenticated routes ──────────────────────────────────────────

  router.post('/logout', auth, authController.logout);
  router.post('/change-password', auth, validate(changePasswordSchema), authController.changePassword);
  router.get('/profile', auth, authController.getProfile);
  router.put('/profile', auth, validate(updateUserProfileSchema), authController.updateProfile);

  // ─── User management (PROPIETARIO only) ────────────────────────────

  router.get('/users', auth, rbac(['PROPIETARIO']), validateQuery(userFiltersSchema), userController.listUsers);
  router.get('/users/:id', auth, rbac(['PROPIETARIO']), validateParams(uuidParamSchema), userController.getUserById);
  router.patch('/users/:id/deactivate', auth, rbac(['PROPIETARIO']), userController.deactivateUser);
  router.patch('/users/:id/activate', auth, rbac(['PROPIETARIO']), userController.activateUser);
  router.patch('/users/:id/block', auth, rbac(['PROPIETARIO']), userController.blockUser);
  router.post('/users/:id/roles', auth, rbac(['PROPIETARIO']), userController.assignRole);
  router.delete('/users/:id/roles', auth, rbac(['PROPIETARIO']), userController.removeRole);

  // ─── Role management (PROPIETARIO only) ────────────────────────────

  router.post('/roles', auth, rbac(['PROPIETARIO']), validate(createRoleSchema), roleController.createRole);
  router.put('/roles/:id', auth, rbac(['PROPIETARIO']), validate(updateRoleSchema), roleController.updateRole);
  router.delete('/roles/:id', auth, rbac(['PROPIETARIO']), roleController.deleteRole);
  router.get('/roles/:id', auth, rbac(['PROPIETARIO']), roleController.getRoleById);
  router.get('/roles', auth, rbac(['PROPIETARIO']), roleController.listRoles);

  // ─── Permission management (PROPIETARIO only) ──────────────────────

  router.post('/permissions', auth, rbac(['PROPIETARIO']), validate(createPermissionSchema), permissionController.createPermission);
  router.put('/permissions/:id', auth, rbac(['PROPIETARIO']), validate(updatePermissionSchema), permissionController.updatePermission);
  router.delete('/permissions/:id', auth, rbac(['PROPIETARIO']), permissionController.deletePermission);
  router.get('/permissions', auth, rbac(['PROPIETARIO']), permissionController.listPermissions);

  // ─── Audit logs (PROPIETARIO / ADMINISTRATIVO) ─────────────────────

  router.get('/audit-logs', auth, rbac(['PROPIETARIO', 'ADMINISTRATIVO']), validateQuery(auditLogFiltersSchema), auditController.getAuditLogs);

  return router;
}
