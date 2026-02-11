import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { createPagination } from '../../../domain/shared/Pagination';
import { ISyncLogRepository } from '../../../domain/sync/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO, PaginatedResponseDTO, createPaginatedResponse } from '../../shared/dtos/PaginationDTO';
import { SyncHistoryFiltersDTO, SyncLogResponseDTO } from '../dtos/SyncDTOs';
import { SyncLogMapper } from '../mappers/SyncLogMapper';

interface GetSyncHistoryInput {
  readonly filters: SyncHistoryFiltersDTO;
  readonly pagination: PaginationInputDTO;
}

export class GetSyncHistory implements IUseCase<GetSyncHistoryInput, PaginatedResponseDTO<SyncLogResponseDTO>> {
  constructor(
    private readonly syncLogRepository: ISyncLogRepository,
  ) {}

  async execute(input: GetSyncHistoryInput): Promise<Result<PaginatedResponseDTO<SyncLogResponseDTO>>> {
    try {
      const { filters, pagination: paginationInput } = input;
      const page = paginationInput.page ?? 1;
      const pageSize = paginationInput.pageSize ?? 20;
      const pagination = createPagination(page, pageSize);

      let logs: import('../../../domain/sync/entities/SyncLog').SyncLog[];

      if (filters.userId) {
        const userId = new UniqueId(filters.userId);
        logs = await this.syncLogRepository.findByUser(userId, pagination);
      } else if (filters.deviceId) {
        logs = await this.syncLogRepository.findByDevice(filters.deviceId, pagination);
      } else {
        // Fallback: fetch error logs or all available logs
        logs = await this.syncLogRepository.findWithErrors();
      }

      // Apply additional filters in-memory when needed
      let filtered = logs;

      if (filters.status) {
        filtered = filtered.filter((log) => log.status === filters.status);
      }

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        filtered = filtered.filter((log) => log.startDate >= start);
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        filtered = filtered.filter((log) => log.startDate <= end);
      }

      const total = filtered.length;
      const items = filtered.map(SyncLogMapper.toDTO);
      const response = createPaginatedResponse(items, total, page, pageSize);

      return Result.ok<PaginatedResponseDTO<SyncLogResponseDTO>>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error getting sync history';
      return Result.fail<PaginatedResponseDTO<SyncLogResponseDTO>>(message);
    }
  }
}
