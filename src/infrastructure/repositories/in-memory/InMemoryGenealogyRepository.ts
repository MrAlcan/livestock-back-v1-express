import { UniqueId } from '../../../domain/shared/Entity';
import { IGenealogyRepository } from '../../../domain/animals/repositories/IGenealogyRepository';
import { Genealogy } from '../../../domain/animals/entities/Genealogy';

export class InMemoryGenealogyRepository implements IGenealogyRepository {
  private items: Map<string, Genealogy> = new Map();

  async findByAnimal(animalId: UniqueId): Promise<Genealogy[]> {
    return Array.from(this.items.values()).filter(
      (g) => g.animalId.value === animalId.value,
    );
  }

  async findByGeneration(animalId: UniqueId, generation: number): Promise<Genealogy[]> {
    return Array.from(this.items.values()).filter(
      (g) => g.animalId.value === animalId.value && g.generation === generation,
    );
  }

  async findCommonAncestors(animal1Id: UniqueId, animal2Id: UniqueId): Promise<Genealogy[]> {
    const animal1Ancestors = Array.from(this.items.values()).filter(
      (g) => g.animalId.value === animal1Id.value,
    );
    const animal2AncestorIds = new Set(
      Array.from(this.items.values())
        .filter((g) => g.animalId.value === animal2Id.value)
        .map((g) => g.ancestorId.value),
    );
    return animal1Ancestors.filter((g) => animal2AncestorIds.has(g.ancestorId.value));
  }

  async create(genealogy: Genealogy): Promise<Genealogy> {
    this.items.set(genealogy.id.value, genealogy);
    return genealogy;
  }

  async bulkCreate(genealogies: Genealogy[]): Promise<Genealogy[]> {
    for (const g of genealogies) {
      this.items.set(g.id.value, g);
    }
    return genealogies;
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Genealogy[] {
    return Array.from(this.items.values());
  }
}
