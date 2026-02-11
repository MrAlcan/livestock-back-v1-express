import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { RegulatoryDocument } from '../../../domain/senasag/entities/RegulatoryDocument';
import { DocumentStatus } from '../../../domain/senasag/enums';
import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories/IRegulatoryDocumentRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateRegulatoryDocumentInputDTO, RegulatoryDocumentResponseDTO } from '../dtos/SenasagDTOs';
import { RegulatoryDocumentMapper } from '../mappers/RegulatoryDocumentMapper';

export class UpdateDocumentStatus implements IUseCase<UpdateRegulatoryDocumentInputDTO, RegulatoryDocumentResponseDTO> {
  constructor(
    private readonly regulatoryDocumentRepository: IRegulatoryDocumentRepository,
  ) {}

  async execute(input: UpdateRegulatoryDocumentInputDTO): Promise<Result<RegulatoryDocumentResponseDTO>> {
    try {
      const doc = await this.regulatoryDocumentRepository.findById(new UniqueId(input.id));
      if (!doc) {
        return Result.fail<RegulatoryDocumentResponseDTO>('Regulatory document not found');
      }

      // Reconstruct with updated fields
      const updatedDoc = RegulatoryDocument.create(
        {
          type: doc.type,
          documentNumber: doc.documentNumber,
          farmId: doc.farmId,
          issueDate: doc.issueDate,
          expirationDate: doc.expirationDate,
          issuingEntity: doc.issuingEntity,
          fileUrl: input.fileUrl !== undefined ? input.fileUrl : doc.fileUrl,
          fileHash: doc.fileHash,
          status: input.status !== undefined ? input.status : doc.status,
          daysBeforeExpiration: doc.daysBeforeExpiration,
          observations: input.observations !== undefined ? input.observations : doc.observations,
          metadata: doc.metadata,
        },
        doc.id,
        doc.createdAt,
      );

      const saved = await this.regulatoryDocumentRepository.update(updatedDoc);

      return Result.ok<RegulatoryDocumentResponseDTO>(RegulatoryDocumentMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating regulatory document';
      return Result.fail<RegulatoryDocumentResponseDTO>(message);
    }
  }
}
