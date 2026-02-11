import { AuditLog } from '../../../domain/auth/entities/AuditLog';
import { AuditLogResponseDTO } from '../dtos/AuthDTOs';

export class AuditLogMapper {
  static toDTO(log: AuditLog): AuditLogResponseDTO {
    return {
      id: log.id.value,
      userId: log.userId.value,
      action: log.action,
      tableName: log.tableName,
      recordId: log.recordId,
      oldValues: log.oldValues,
      newValues: log.newValues,
      ipAddress: log.ipAddress,
      createdAt: log.createdAt.toISOString(),
    };
  }
}
