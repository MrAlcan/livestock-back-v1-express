import { Result } from '../../../domain/shared/Result';
import { IRoleRepository } from '../../../domain/auth/repositories/IRoleRepository';
import { IUseCase } from '../../shared/types/IUseCase';
import { RoleResponseDTO } from '../dtos/AuthDTOs';
import { RoleMapper } from '../mappers/RoleMapper';

export class ListRoles implements IUseCase<void, RoleResponseDTO[]> {
  constructor(
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(): Promise<Result<RoleResponseDTO[]>> {
    const roles = await this.roleRepository.findAll();
    const roleDTOs = roles.map((role) => RoleMapper.toDTO(role));

    return Result.ok<RoleResponseDTO[]>(roleDTOs);
  }
}
