import { Result } from '../../../domain/shared/Result';
import { UniqueId } from '../../../domain/shared/Entity';
import { ThirdParty } from '../../../domain/finance/entities/ThirdParty';
import { IThirdPartyRepository } from '../../../domain/finance/repositories';
import { IUseCase } from '../../shared/types/IUseCase';
import { UpdateThirdPartyInputDTO, ThirdPartyResponseDTO } from '../dtos/FinanceDTOs';
import { ThirdPartyMapper } from '../mappers/ThirdPartyMapper';

export class UpdateThirdParty implements IUseCase<UpdateThirdPartyInputDTO, ThirdPartyResponseDTO> {
  constructor(
    private readonly thirdPartyRepository: IThirdPartyRepository,
  ) {}

  async execute(input: UpdateThirdPartyInputDTO): Promise<Result<ThirdPartyResponseDTO>> {
    try {
      const existing = await this.thirdPartyRepository.findById(new UniqueId(input.id));
      if (!existing) {
        return Result.fail<ThirdPartyResponseDTO>('Third party not found');
      }

      // Reconstruct with updated fields
      const updated = ThirdParty.create(
        {
          code: existing.code,
          name: input.name !== undefined ? input.name : existing.name,
          tradeName: input.tradeName !== undefined ? input.tradeName : existing.tradeName,
          type: existing.type,
          subtype: existing.subtype,
          taxId: existing.taxId,
          idType: existing.idType,
          rtaCode: existing.rtaCode,
          rtaExpiration: existing.rtaExpiration,
          address: input.address !== undefined ? input.address : existing.address,
          phone: input.phone !== undefined ? input.phone : existing.phone,
          email: input.email !== undefined ? input.email : existing.email,
          contactPerson: input.contactPerson !== undefined ? input.contactPerson : existing.contactPerson,
          rating: existing.rating,
          creditDays: input.creditDays !== undefined ? input.creditDays : existing.creditDays,
          creditLimit: input.creditLimit !== undefined ? input.creditLimit : existing.creditLimit,
          currentBalance: existing.currentBalance,
          active: existing.active,
          observations: input.observations !== undefined ? input.observations : existing.observations,
        },
        existing.id,
        existing.createdAt,
      );

      const saved = await this.thirdPartyRepository.update(updated);
      return Result.ok<ThirdPartyResponseDTO>(ThirdPartyMapper.toDTO(saved));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error updating third party';
      return Result.fail<ThirdPartyResponseDTO>(message);
    }
  }
}
