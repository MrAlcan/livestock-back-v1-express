import { User } from '../../../domain/auth/entities/User';
import { UserResponseDTO } from '../dtos/AuthDTOs';

export class UserMapper {
  static toDTO(user: User): UserResponseDTO {
    return {
      id: user.id.value,
      fullName: user.fullName,
      email: user.email.value,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      status: user.status,
      roleId: user.roleId,
      farmId: user.farmId.value,
      lastAccess: user.lastAccess?.toISOString(),
      preferences: user.preferences,
    };
  }
}
