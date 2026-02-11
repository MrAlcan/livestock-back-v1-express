import { IBreedRepository } from '../../../domain/animals/repositories/IBreedRepository';
import { Breed } from '../../../domain/animals/entities/Breed';

export class InMemoryBreedRepository implements IBreedRepository {
  private items: Map<number, Breed> = new Map();

  async findById(id: number): Promise<Breed | null> {
    return this.items.get(id) ?? null;
  }

  async findByCode(code: string): Promise<Breed | null> {
    const all = Array.from(this.items.values());
    return all.find((b) => b.code === code) ?? null;
  }

  async findAll(): Promise<Breed[]> {
    return Array.from(this.items.values());
  }

  async findActive(): Promise<Breed[]> {
    return Array.from(this.items.values()).filter((b) => b.active);
  }

  async create(breed: Breed): Promise<Breed> {
    this.items.set(breed.id, breed);
    return breed;
  }

  async update(breed: Breed): Promise<Breed> {
    this.items.set(breed.id, breed);
    return breed;
  }

  async delete(id: number): Promise<void> {
    this.items.delete(id);
  }

  // Test helpers
  clear(): void {
    this.items.clear();
  }

  getAll(): Breed[] {
    return Array.from(this.items.values());
  }
}
