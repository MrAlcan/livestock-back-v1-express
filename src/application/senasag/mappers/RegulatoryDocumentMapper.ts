import { RegulatoryDocument } from '../../../domain/senasag/entities/RegulatoryDocument';
import { RegulatoryDocumentResponseDTO } from '../dtos/SenasagDTOs';

export class RegulatoryDocumentMapper {
  static toDTO(doc: RegulatoryDocument): RegulatoryDocumentResponseDTO {
    return {
      id: doc.id.value,
      type: doc.type,
      documentNumber: doc.documentNumber,
      farmId: doc.farmId?.value,
      issueDate: doc.issueDate.toISOString(),
      expirationDate: doc.expirationDate?.toISOString(),
      issuingEntity: doc.issuingEntity,
      fileUrl: doc.fileUrl,
      status: doc.status,
      daysUntilExpiration: doc.expirationDate ? doc.daysUntilExpiration() : undefined,
      observations: doc.observations,
    };
  }
}
