import { UniqueId } from '../../shared/Entity';

export interface ValidationResultItem {
  animalId: string;
  isValid: boolean;
  reasons: string[];
}

export interface GMAValidationResult {
  isValid: boolean;
  items: ValidationResultItem[];
  globalErrors: string[];
}

export class GMAValidationService {
  /**
   * Validates that all requirements are met for generating a GMA.
   * This is a domain service interface - actual implementation depends on repositories.
   *
   * Requirements:
   * 1. RUNSA must be valid (not expired)
   * 2. Each animal must have a valid Aftosa vaccine (last 6 months)
   * 3. No animal should be in a withdrawal period
   * 4. All animals must be active (not dead/sold)
   */
  validateAnimalIds(animalIds: string[]): ValidationResultItem[] {
    // This method provides the structure for validation results.
    // Full implementation requires access to repositories (done in application layer).
    return animalIds.map(id => ({
      animalId: id,
      isValid: true,
      reasons: [],
    }));
  }
}

export class GMACodeGeneratorService {
  generateInternalNumber(farmCode: string, year: number, sequential: number): string {
    const paddedSequential = sequential.toString().padStart(4, '0');
    return `GMA-${farmCode}-${year}-${paddedSequential}`;
  }
}
