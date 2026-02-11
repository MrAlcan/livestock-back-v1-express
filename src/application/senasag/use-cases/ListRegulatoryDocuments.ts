import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { DocumentType } from '../../../domain/senasag/enums';
import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories/IRegulatoryDocumentRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RegulatoryDocumentResponseDTO } from '../dtos/SenasagDTOs';
import { RegulatoryDocumentMapper } from '../mappers/RegulatoryDocumentMapper';

interface ListRegulatoryDocumentsInputDTO {
  readonly farmId: string;
  readonly type?: DocumentType;
}

export class ListRegulatoryDocuments implements IUseCase<ListRegulatoryDocumentsInputDTO, RegulatoryDocumentResponseDTO[]> {
  constructor(
    private readonly regulatoryDocumentRepository: IRegulatoryDocumentRepository,
  ) {}

  async execute(input: ListRegulatoryDocumentsInputDTO): Promise<Result<RegulatoryDocumentResponseDTO[]>> {
    try {
      const farmId = new UniqueId(input.farmId);
      const documents = await this.regulatoryDocumentRepository.findByFarm(farmId, input.type);

      const dtos = documents.map(RegulatoryDocumentMapper.toDTO);
      return Result.ok<RegulatoryDocumentResponseDTO[]>(dtos);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing regulatory documents';
      return Result.fail<RegulatoryDocumentResponseDTO[]>(message);
    }
  }
}
