import { Result } from '../../../domain/shared/Result';
import { IUserRepository, UserFilters } from '../../../domain/auth/repositories/IUserRepository';
import { createPagination } from '../../../domain/shared/Pagination';
import { IUseCase } from '../../shared/types/IUseCase';
import { PaginationInputDTO } from '../../shared/dtos/PaginationDTO';
import { UserResponseDTO, UserFiltersDTO } from '../dtos/AuthDTOs';
import { UserMapper } from '../mappers/UserMapper';

interface ListUsersInput {
  readonly filters: UserFiltersDTO;
  readonly pagination: PaginationInputDTO;
}

export class ListUsers implements IUseCase<ListUsersInput, UserResponseDTO[]> {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: ListUsersInput): Promise<Result<UserResponseDTO[]>> {
    const pagination = createPagination(
      input.pagination.page,
      input.pagination.pageSize,
    );

    const filters: UserFilters = {
      status: input.filters.status,
      farmId: input.filters.farmId,
      roleId: input.filters.roleId,
      search: input.filters.search,
    };

    const users = await this.userRepository.findAll(filters, pagination);
    const userDTOs = users.map((user) => UserMapper.toDTO(user));

    return Result.ok<UserResponseDTO[]>(userDTOs);
  }
}
