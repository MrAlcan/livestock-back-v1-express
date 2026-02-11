import { Result } from '../../../domain/shared/Result';
import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories/IRegulatoryDocumentRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { ExpiringDocumentsResponseDTO } from '../dtos/SenasagDTOs';
import { RegulatoryDocumentMapper } from '../mappers/RegulatoryDocumentMapper';

interface GetExpiringDocumentsInputDTO {
  readonly daysThreshold?: number;
}

const DEFAULT_DAYS_THRESHOLD = 30;

export class GetExpiringDocuments implements IUseCase<GetExpiringDocumentsInputDTO, ExpiringDocumentsResponseDTO> {
  constructor(
    private readonly regulatoryDocumentRepository: IRegulatoryDocumentRepository,
  ) {}

  async execute(input: GetExpiringDocumentsInputDTO): Promise<Result<ExpiringDocumentsResponseDTO>> {
    try {
      const threshold = input.daysThreshold ?? DEFAULT_DAYS_THRESHOLD;

      if (threshold <= 0) {
        return Result.fail<ExpiringDocumentsResponseDTO>('Days threshold must be greater than zero');
      }

      const documents = await this.regulatoryDocumentRepository.findExpiringSoon(threshold);

      const dtos = documents.map(RegulatoryDocumentMapper.toDTO);

      return Result.ok<ExpiringDocumentsResponseDTO>({
        documents: dtos,
        threshold,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error retrieving expiring documents';
      return Result.fail<ExpiringDocumentsResponseDTO>(message);
    }
  }
}
