import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { RegulatoryDocument } from '../../../domain/senasag/entities/RegulatoryDocument';
import { DocumentStatus } from '../../../domain/senasag/enums';
import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories/IRegulatoryDocumentRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { CreateRegulatoryDocumentInputDTO, RegulatoryDocumentResponseDTO } from '../dtos/SenasagDTOs';
import { RegulatoryDocumentMapper } from '../mappers/RegulatoryDocumentMapper';

export class CreateRegulatoryDocument implements IUseCase<CreateRegulatoryDocumentInputDTO, RegulatoryDocumentResponseDTO> {
  constructor(
    private readonly regulatoryDocumentRepository: IRegulatoryDocumentRepository,
  ) {}

  async execute(input: CreateRegulatoryDocumentInputDTO): Promise<Result<RegulatoryDocumentResponseDTO>> {
    try {
      if (!input.documentNumber || input.documentNumber.trim().length === 0) {
        return Result.fail<RegulatoryDocumentResponseDTO>('Document number is required');
      }

      const expirationDate = input.expirationDate ? new Date(input.expirationDate) : undefined;
      const issueDate = new Date(input.issueDate);

      if (expirationDate && expirationDate <= issueDate) {
        return Result.fail<RegulatoryDocumentResponseDTO>('Expiration date must be after issue date');
      }

      // Determine initial status based on expiration date
      let status = DocumentStatus.VALID;
      const defaultDaysBeforeExpiration = 30;

      if (expirationDate) {
        const now = new Date();
        if (expirationDate <= now) {
          status = DocumentStatus.EXPIRED;
        } else {
          const diffMs = expirationDate.getTime() - now.getTime();
          const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (daysUntil <= defaultDaysBeforeExpiration) {
            status = DocumentStatus.EXPIRING_SOON;
          }
        }
      }

      const doc = RegulatoryDocument.create({
        type: input.type,
        documentNumber: input.documentNumber,
        farmId: input.farmId ? new UniqueId(input.farmId) : undefined,
        issueDate,
        expirationDate,
        issuingEntity: input.issuingEntity,
        fileUrl: input.fileUrl,
        status,
        daysBeforeExpiration: defaultDaysBeforeExpiration,
        observations: input.observations,
      });

      const saved = await this.regulatoryDocumentRepository.create(doc);

      return Result.ok<RegulatoryDocumentResponseDTO>(RegulatoryDocumentMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error creating regulatory document';
      return Result.fail<RegulatoryDocumentResponseDTO>(message);
    }
  }
}
