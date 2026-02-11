import { UniqueId } from '../../../domain/shared/Entity';
import { IRegulatoryDocumentRepository } from '../../../domain/senasag/repositories';
import { RegulatoryDocument } from '../../../domain/senasag/entities/RegulatoryDocument';
import { DocumentType } from '../../../domain/senasag/enums';

export class InMemoryRegulatoryDocumentRepository implements IRegulatoryDocumentRepository {
  private items: Map<string, RegulatoryDocument> = new Map();

  async findById(id: UniqueId): Promise<RegulatoryDocument | null> {
    return this.items.get(id.value) ?? null;
  }

  async findByFarm(farmId: UniqueId, type?: DocumentType): Promise<RegulatoryDocument[]> {
    let result = Array.from(this.items.values()).filter(
      (d) => d.farmId?.value === farmId.value,
    );
    if (type !== undefined) {
      result = result.filter((d) => d.type === type);
    }
    return result;
  }

  async findExpiringSoon(daysThreshold: number): Promise<RegulatoryDocument[]> {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
    return Array.from(this.items.values()).filter((d) => {
      if (!d.expirationDate) return false;
      return d.expirationDate > now && d.expirationDate <= thresholdDate;
    });
  }

  async findExpired(): Promise<RegulatoryDocument[]> {
    const now = new Date();
    return Array.from(this.items.values()).filter((d) => {
      if (!d.expirationDate) return false;
      return d.expirationDate < now;
    });
  }

  async findRUNSA(farmId: UniqueId): Promise<RegulatoryDocument | null> {
    const all = Array.from(this.items.values());
    return (
      all.find(
        (d) => d.farmId?.value === farmId.value && d.type === DocumentType.RUNSA,
      ) ?? null
    );
  }

  async create(doc: RegulatoryDocument): Promise<RegulatoryDocument> {
    this.items.set(doc.id.value, doc);
    return doc;
  }

  async update(doc: RegulatoryDocument): Promise<RegulatoryDocument> {
    this.items.set(doc.id.value, doc);
    return doc;
  }

  async delete(id: UniqueId): Promise<void> {
    this.items.delete(id.value);
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): RegulatoryDocument[] {
    return Array.from(this.items.values());
  }
}
