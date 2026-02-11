import { FinancialCategory } from '../../../domain/finance/entities/FinancialCategory';
import { FinancialCategoryResponseDTO } from '../dtos/FinanceDTOs';

export class FinancialCategoryMapper {
  static toDTO(category: FinancialCategory): FinancialCategoryResponseDTO {
    return {
      id: category.id,
      code: category.code,
      name: category.name,
      type: category.type,
      parentId: category.parentId,
      level: category.level,
      description: category.description,
      active: category.active,
    };
  }
}
