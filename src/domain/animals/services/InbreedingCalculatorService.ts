import { UniqueId } from '../../shared/Entity';
import { IGenealogyRepository } from '../repositories/IGenealogyRepository';

export class InbreedingCalculatorService {
  constructor(private readonly genealogyRepository: IGenealogyRepository) {}

  async calculateInbreedingCoefficient(animal1Id: UniqueId, animal2Id: UniqueId): Promise<number> {
    const commonAncestors = await this.genealogyRepository.findCommonAncestors(animal1Id, animal2Id);

    if (commonAncestors.length === 0) {
      return 0;
    }

    // Simplified Wright's formula
    let coefficient = 0;
    for (const ancestor of commonAncestors) {
      const generation = ancestor.generation;
      coefficient += Math.pow(0.5, generation + 1);
    }

    return Math.min(coefficient, 1);
  }
}
