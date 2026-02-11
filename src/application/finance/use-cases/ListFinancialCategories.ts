import { Result } from '../../../domain/shared/Result';
import { IFinancialCategoryRepository } from '../../../domain/finance/repositories';
import { FinancialType } from '../../../domain/finance/enums';
import { IUseCase } from '../../shared/types/IUseCase';
import { FinancialCategoryResponseDTO } from '../dtos/FinanceDTOs';
import { FinancialCategoryMapper } from '../mappers/FinancialCategoryMapper';

interface ListFinancialCategoriesInput {
  readonly type?: FinancialType;
  readonly parentId?: number;
}

export class ListFinancialCategories implements IUseCase<ListFinancialCategoriesInput, FinancialCategoryResponseDTO[]> {
  constructor(
    private readonly categoryRepository: IFinancialCategoryRepository,
  ) {}

  async execute(input: ListFinancialCategoriesInput): Promise<Result<FinancialCategoryResponseDTO[]>> {
    try {
      let categories;

      if (input.parentId !== undefined) {
        categories = await this.categoryRepository.findByParent(input.parentId);
      } else if (input.type) {
        categories = await this.categoryRepository.findByType(input.type);
      } else {
        categories = await this.categoryRepository.findAll();
      }

      const items = categories.map(FinancialCategoryMapper.toDTO);
      return Result.ok<FinancialCategoryResponseDTO[]>(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error listing financial categories';
      return Result.fail<FinancialCategoryResponseDTO[]>(message);
    }
  }
}
