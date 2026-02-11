import { UniqueId } from '../../shared/Entity';
import { Genealogy } from '../entities/Genealogy';

export interface IGenealogyRepository {
  findByAnimal(animalId: UniqueId): Promise<Genealogy[]>;
  findByGeneration(animalId: UniqueId, generation: number): Promise<Genealogy[]>;
  findCommonAncestors(animal1Id: UniqueId, animal2Id: UniqueId): Promise<Genealogy[]>;
  create(genealogy: Genealogy): Promise<Genealogy>;
  bulkCreate(genealogies: Genealogy[]): Promise<Genealogy[]>;
}
