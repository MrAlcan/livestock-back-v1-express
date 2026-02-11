import { Breed } from '../entities/Breed';

export interface IBreedRepository {
  findById(id: number): Promise<Breed | null>;
  findByCode(code: string): Promise<Breed | null>;
  findAll(): Promise<Breed[]>;
  findActive(): Promise<Breed[]>;
  create(breed: Breed): Promise<Breed>;
  update(breed: Breed): Promise<Breed>;
  delete(id: number): Promise<void>;
}
