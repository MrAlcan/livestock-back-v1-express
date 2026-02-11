import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { IAuditLogRepository } from '../../../domain/auth/repositories/IAuditLogRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { AuditLogResponseDTO, AuditLogFiltersDTO } from '../dtos/AuthDTOs';
import { AuditLogMapper } from '../mappers/AuditLogMapper';

interface GetAuditLogsInput {
  readonly filters: AuditLogFiltersDTO;
  readonly pagination: PaginationInputDTO;
}

export class GetAuditLogs implements IUseCase<GetAuditLogsInput, AuditLogResponseDTO[]> {
  constructor(
    private readonly auditLogRepository: IAuditLogRepository,
  ) {}

  async execute(input: GetAuditLogsInput): Promise<Result<AuditLogResponseDTO[]>> {
    const pagination = createPagination(
      input.pagination.page,
      input.pagination.pageSize,
    );

    let logs;

    if (input.filters.userId) {
      const userId = new UniqueId(input.filters.userId);
      logs = await this.auditLogRepository.findByUserId(userId, pagination);
    } else if (input.filters.tableName && input.filters.recordId) {
      logs = await this.auditLogRepository.findByRecordId(
        input.filters.tableName,
        input.filters.recordId,
      );
    } else if (input.filters.tableName) {
      logs = await this.auditLogRepository.findByTable(
        input.filters.tableName,
        pagination,
      );
    } else {
      // Default: return empty if no filter criteria provided
      return Result.ok<AuditLogResponseDTO[]>([]);
    }

    const logDTOs = logs.map((log) => AuditLogMapper.toDTO(log));

    return Result.ok<AuditLogResponseDTO[]>(logDTOs);
  }
}
