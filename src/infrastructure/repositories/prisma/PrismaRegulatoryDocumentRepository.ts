import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories';
import { RegulatoryDocument } from '../../../domain/senasag/entities/RegulatoryDocument';
import { UniqueId } from '../../../domain/shared/Entity';
import { DocumentType, DocumentStatus } from '../../../domain/senasag/enums';
import { PrismaBaseRepository } from './PrismaBaseRepository';
import { PrismaService } from '../../database/prisma.service';

export class PrismaRegulatoryDocumentRepository
  extends PrismaBaseRepository
  implements IRegulatoryDocumentRepository {

  constructor(prisma: PrismaService) {
    super(prisma, 'PrismaRegulatoryDocumentRepository');
  }

  async findById(id: UniqueId): Promise<RegulatoryDocument | null> {
    try {
      const record = await (this.prisma as any).regulatoryDocument.findUnique({
        where: { id: id.value },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findByFarm(farmId: UniqueId, type?: DocumentType): Promise<RegulatoryDocument[]> {
    try {
      const where: Record<string, unknown> = { farmId: farmId.value };
      if (type) where.type = type;
      const records = await (this.prisma as any).regulatoryDocument.findMany({
        where,
        orderBy: { issueDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findExpiringSoon(daysThreshold: number): Promise<RegulatoryDocument[]> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
      const records = await (this.prisma as any).regulatoryDocument.findMany({
        where: {
          expirationDate: {
            gte: new Date(),
            lte: thresholdDate,
          },
          status: { not: DocumentStatus.EXPIRED },
        },
        orderBy: { expirationDate: 'asc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findExpired(): Promise<RegulatoryDocument[]> {
    try {
      const records = await (this.prisma as any).regulatoryDocument.findMany({
        where: {
          expirationDate: { lt: new Date() },
        },
        orderBy: { expirationDate: 'desc' },
      });
      return records.map((r: any) => this.toDomain(r));
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findRUNSA(farmId: UniqueId): Promise<RegulatoryDocument | null> {
    try {
      const record = await (this.prisma as any).regulatoryDocument.findFirst({
        where: {
          farmId: farmId.value,
          type: DocumentType.RUNSA,
          status: DocumentStatus.VALID,
        },
        orderBy: { issueDate: 'desc' },
      });
      return record ? this.toDomain(record) : null;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(doc: RegulatoryDocument): Promise<RegulatoryDocument> {
    try {
      const record = await (this.prisma as any).regulatoryDocument.create({
        data: {
          id: doc.id.value,
          type: doc.type,
          documentNumber: doc.documentNumber,
          farmId: doc.farmId?.value,
          issueDate: doc.issueDate,
          expirationDate: doc.expirationDate,
          issuingEntity: doc.issuingEntity,
          fileUrl: doc.fileUrl,
          fileHash: doc.fileHash,
          status: doc.status,
          daysBeforeExpiration: doc.daysBeforeExpiration,
          observations: doc.observations,
          metadata: doc.metadata,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(doc: RegulatoryDocument): Promise<RegulatoryDocument> {
    try {
      const record = await (this.prisma as any).regulatoryDocument.update({
        where: { id: doc.id.value },
        data: {
          documentNumber: doc.documentNumber,
          farmId: doc.farmId?.value,
          issueDate: doc.issueDate,
          expirationDate: doc.expirationDate,
          issuingEntity: doc.issuingEntity,
          fileUrl: doc.fileUrl,
          fileHash: doc.fileHash,
          status: doc.status,
          daysBeforeExpiration: doc.daysBeforeExpiration,
          observations: doc.observations,
          metadata: doc.metadata,
          updatedAt: doc.updatedAt,
        },
      });
      return this.toDomain(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: UniqueId): Promise<void> {
    try {
      await (this.prisma as any).regulatoryDocument.delete({
        where: { id: id.value },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private toDomain(record: any): RegulatoryDocument {
    return RegulatoryDocument.create(
      {
        type: record.type as DocumentType,
        documentNumber: record.documentNumber,
        farmId: record.farmId ? new UniqueId(record.farmId) : undefined,
        issueDate: record.issueDate ? new Date(record.issueDate) : new Date(record.createdAt),
        expirationDate: record.expirationDate ? new Date(record.expirationDate) : undefined,
        issuingEntity: record.issuingEntity ?? undefined,
        fileUrl: record.fileUrl ?? undefined,
        fileHash: record.fileHash ?? undefined,
        status: record.status as DocumentStatus,
        daysBeforeExpiration: record.daysBeforeExpiration,
        observations: record.observations ?? undefined,
        metadata: record.metadata ?? undefined,
      },
      new UniqueId(record.id),
      new Date(record.createdAt),
      new Date(record.updatedAt),
    );
  }
}
