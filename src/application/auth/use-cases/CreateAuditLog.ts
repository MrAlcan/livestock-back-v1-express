import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { AuditLog } from '../../../domain/auth/entities/AuditLog';
import { AuditAction } from '../../../domain/auth/enums/AuditAction';
import { IAuditLogRepository } from '../../../domain/auth/repositories/IAuditLogRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { AuditLogResponseDTO } from '../dtos/AuthDTOs';
import { AuditLogMapper } from '../mappers/AuditLogMapper';

interface CreateAuditLogInput {
  readonly userId: string;
  readonly action: AuditAction;
  readonly tableName: string;
  readonly recordId: string;
  readonly oldValues?: Record<string, unknown>;
  readonly newValues?: Record<string, unknown>;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

export class CreateAuditLog implements IUseCase<CreateAuditLogInput, AuditLogResponseDTO> {
  constructor(
    private readonly auditLogRepository: IAuditLogRepository,
  ) {}

  async execute(input: CreateAuditLogInput): Promise<Result<AuditLogResponseDTO>> {
    const auditLog = AuditLog.create({
      userId: new UniqueId(input.userId),
      action: input.action,
      tableName: input.tableName,
      recordId: input.recordId,
      oldValues: input.oldValues,
      newValues: input.newValues,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    const savedLog = await this.auditLogRepository.create(auditLog);

    return Result.ok<AuditLogResponseDTO>(AuditLogMapper.toDTO(savedLog));
  }
}
